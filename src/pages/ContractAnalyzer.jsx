// src/pages/ContractAnalyzer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzeContract } from '../lib/groq'
import Icon from '../components/Icon'

function ContractAnalyzer() {
  const [file, setFile] = useState(null)
  const [contractText, setContractText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [inputMethod, setInputMethod] = useState('paste') // 'paste' or 'upload'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        setContractText(event.target.result)
      }
      reader.onerror = () => {
        setError('Could not read file. Please try pasting the text instead.')
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError('Please paste your contract text or upload a file')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysis = await analyzeContract(contractText)
      setResults(analysis)
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze contract. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setContractText('')
    setResults(null)
    setError(null)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-200'
    if (score >= 60) return 'text-amber-200'
    return 'text-red-200'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'border-emerald-400/30'
    if (score >= 60) return 'border-amber-400/30'
    return 'border-red-400/30'
  }

  const getVerdictStyle = (verdict) => {
    if (verdict?.includes('SAFE')) return 'bg-emerald-500/80 text-white'
    if (verdict?.includes('REVIEW') || verdict?.includes('CAREFULLY')) return 'bg-amber-500/80 text-white'
    return 'bg-red-500/80 text-white'
  }

  return (
    <div className="min-h-screen space-y-8">
      <nav>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Icon name="arrowLeft" size={16} />
          Back to Home
        </Link>
      </nav>

      <header className="glass-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="document" size={22} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Contract Analyzer</h1>
          <span className="glass-chip text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
        </div>
        <p className="text-slate-400 text-lg">
          Upload your rental contract and our AI will scan for red flags, unusual clauses, and potential issues.
        </p>
      </header>

      {results ? (
        <div className="space-y-6">
          <div className={`glass-3d rounded-3xl p-6 ${getScoreBg(results.score)}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide">Safety Score</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-5xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}
                  </span>
                  <span className="text-slate-400 text-2xl">/100</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${getVerdictStyle(results.verdict)}`}>
                {results.verdict}
              </div>
            </div>
            <p className="text-slate-300 mt-4">{results.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-200">{results.redFlags?.length || 0}</div>
              <div className="text-slate-400 text-sm">Red Flags</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-200">{results.warnings?.length || 0}</div>
              <div className="text-slate-400 text-sm">Warnings</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-200">{results.goodClauses?.length || 0}</div>
              <div className="text-slate-400 text-sm">Good Clauses</div>
            </div>
          </div>

          {results.redFlags?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-200 flex items-center gap-2">
                <Icon name="alert" size={18} className="text-red-200" />
                Red Flags
              </h2>
              <div className="space-y-4">
                {results.redFlags.map((flag, index) => (
                  <div key={index} className="glass-panel rounded-2xl p-4 border border-red-500/30">
                    <div className="flex items-start gap-3">
                      <Icon name="warning" size={18} className="text-red-200 mt-1" />
                      <div className="flex-1">
                        {flag.clause && (
                          <p className="text-slate-300 text-sm italic mb-2">"{flag.clause}"</p>
                        )}
                        <p className="text-white font-medium">{flag.issue}</p>
                        {flag.recommendation && (
                          <p className="text-slate-400 text-sm mt-2">
                            <span className="text-emerald-200">Recommendation:</span> {flag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.warnings?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-200 flex items-center gap-2">
                <Icon name="warning" size={18} className="text-amber-200" />
                Warnings
              </h2>
              <div className="space-y-4">
                {results.warnings.map((warning, index) => (
                  <div key={index} className="glass-panel rounded-2xl p-4 border border-amber-400/30">
                    <div className="flex items-start gap-3">
                      <Icon name="bolt" size={18} className="text-amber-200 mt-1" />
                      <div className="flex-1">
                        {warning.clause && (
                          <p className="text-slate-300 text-sm italic mb-2">"{warning.clause}"</p>
                        )}
                        <p className="text-white font-medium">{warning.issue}</p>
                        {warning.recommendation && (
                          <p className="text-slate-400 text-sm mt-2">
                            <span className="text-emerald-200">Recommendation:</span> {warning.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.goodClauses?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-emerald-200 flex items-center gap-2">
                <Icon name="success" size={18} className="text-emerald-200" />
                Good Clauses
              </h2>
              <div className="space-y-4">
                {results.goodClauses.map((good, index) => (
                  <div key={index} className="glass-panel rounded-2xl p-4 border border-emerald-400/30">
                    <div className="flex items-start gap-3">
                      <Icon name="success" size={18} className="text-emerald-200 mt-1" />
                      <div className="flex-1">
                        {good.clause && (
                          <p className="text-slate-300 text-sm italic mb-2">"{good.clause}"</p>
                        )}
                        <p className="text-white">{good.why}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.questions?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Icon name="info" size={18} className="text-slate-200" />
                Questions to Ask the Landlord
              </h2>
              <div className="glass-panel rounded-2xl p-4">
                <ul className="space-y-2">
                  {results.questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-slate-400">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="shield" size={20} className="text-slate-100" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Want a Professional Review?</h3>
                <p className="text-slate-400 mb-4">
                  Our partner lawyers can review your contract in detail and provide legal advice specific to your situation.
                </p>
                <ul className="text-slate-300 text-sm mb-4 space-y-1">
                  <li className="flex items-center gap-2"><Icon name="success" size={12} className="text-emerald-200" /> Detailed written analysis</li>
                  <li className="flex items-center gap-2"><Icon name="success" size={12} className="text-emerald-200" /> Response within 24-48 hours</li>
                  <li className="flex items-center gap-2"><Icon name="success" size={12} className="text-emerald-200" /> Optional video consultation</li>
                </ul>
                <button className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Get Lawyer Review - 149 PLN
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={resetAnalysis}
              className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Analyze Another Contract
            </button>
            <button className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Download Report (PDF)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setInputMethod('paste')}
              className={`glass-chip px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMethod === 'paste'
                  ? 'text-white ring-1 ring-white/20'
                  : 'text-slate-300'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setInputMethod('upload')}
              className={`glass-chip px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMethod === 'upload'
                  ? 'text-white ring-1 ring-white/20'
                  : 'text-slate-300'
              }`}
            >
              Upload File
            </button>
          </div>

          {inputMethod === 'paste' && (
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Paste your contract text below (Polish or English)
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the full rental contract text here...\n\nTip: Copy the text from your PDF or Word document and paste it here. The more complete the contract, the better the analysis."
                rows={12}
                className="w-full glass-panel border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-slate-400"
              />
              <p className="text-slate-500 text-sm mt-2">
                {contractText.length} characters
              </p>
            </div>
          )}

          {inputMethod === 'upload' && (
            <div>
              <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl p-8 text-center transition-colors glass-panel">
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl glass-panel">
                    <Icon name="upload" size={20} className="text-slate-100" />
                  </div>
                  <p className="text-white font-medium mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-slate-500 text-sm">
                    TXT or DOC files (PDF support coming soon)
                  </p>
                </label>
              </div>
              {file && contractText && (
                <p className="text-emerald-200 text-sm mt-2 flex items-center gap-2">
                  <Icon name="success" size={14} className="text-emerald-200" />
                  File loaded - {contractText.length} characters extracted
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="glass-panel border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !contractText.trim()}
            className="w-full glass-strong disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-colors text-lg"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing your contract...
              </span>
            ) : (
              'Analyze Contract'
            )}
          </button>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-6 text-center">
              <Icon name="document" size={22} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">1. Paste or Upload</h3>
              <p className="text-slate-400 text-sm">Paste your contract text or upload the file</p>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center">
              <Icon name="spark" size={22} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">2. AI Analysis</h3>
              <p className="text-slate-400 text-sm">Our AI scans for red flags and unusual clauses</p>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center">
              <Icon name="success" size={22} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">3. Get Results</h3>
              <p className="text-slate-400 text-sm">See what is safe and what needs attention</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Icon name="shield" size={18} className="text-slate-200" />
              <div>
                <h3 className="font-semibold text-white mb-1">Your Privacy is Protected</h3>
                <p className="text-slate-400 text-sm">
                  Your contract is sent securely for analysis and is not stored after processing.
                  We never share your documents with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractAnalyzer
