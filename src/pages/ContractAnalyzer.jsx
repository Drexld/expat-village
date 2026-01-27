// src/pages/ContractAnalyzer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzeContract } from '../lib/groq'

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
      
      // Read text from file
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
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-emerald-900/50 to-emerald-800/30 border-emerald-500/50'
    if (score >= 60) return 'from-amber-900/50 to-amber-800/30 border-amber-500/50'
    return 'from-red-900/50 to-red-800/30 border-red-500/50'
  }

  const getVerdictStyle = (verdict) => {
    if (verdict?.includes('SAFE')) return 'bg-emerald-600 text-white'
    if (verdict?.includes('REVIEW') || verdict?.includes('CAREFULLY')) return 'bg-amber-600 text-white'
    return 'bg-red-600 text-white'
  }

  return (
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📝</span>
          <h1 className="text-3xl font-bold text-white">Contract Analyzer</h1>
          <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
        </div>
        <p className="text-slate-400 text-lg">
          Upload your rental contract and our AI will scan for red flags, unusual clauses, and potential issues.
        </p>
      </header>

      {/* Results View */}
      {results ? (
        <div>
          {/* Score Card */}
          <div className={`bg-gradient-to-r ${getScoreBg(results.score)} border rounded-xl p-6 mb-6`}>
            <div className="flex items-center justify-between">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{results.redFlags?.length || 0}</div>
              <div className="text-red-300 text-sm">Red Flags</div>
            </div>
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{results.warnings?.length || 0}</div>
              <div className="text-amber-300 text-sm">Warnings</div>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{results.goodClauses?.length || 0}</div>
              <div className="text-emerald-300 text-sm">Good Clauses</div>
            </div>
          </div>

          {/* Red Flags */}
          {results.redFlags?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-red-400 mb-4">🚨 Red Flags</h2>
              <div className="space-y-4">
                {results.redFlags.map((flag, index) => (
                  <div key={index} className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-xl">⚠️</span>
                      <div className="flex-1">
                        {flag.clause && (
                          <p className="text-slate-300 text-sm italic mb-2">"{flag.clause}"</p>
                        )}
                        <p className="text-white font-medium">{flag.issue}</p>
                        {flag.recommendation && (
                          <p className="text-slate-400 text-sm mt-2">
                            <span className="text-emerald-400">Recommendation:</span> {flag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {results.warnings?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4">⚠️ Warnings</h2>
              <div className="space-y-4">
                {results.warnings.map((warning, index) => (
                  <div key={index} className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-amber-400 text-xl">⚡</span>
                      <div className="flex-1">
                        {warning.clause && (
                          <p className="text-slate-300 text-sm italic mb-2">"{warning.clause}"</p>
                        )}
                        <p className="text-white font-medium">{warning.issue}</p>
                        {warning.recommendation && (
                          <p className="text-slate-400 text-sm mt-2">
                            <span className="text-emerald-400">Recommendation:</span> {warning.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Good Clauses */}
          {results.goodClauses?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-emerald-400 mb-4">✅ Good Clauses</h2>
              <div className="space-y-4">
                {results.goodClauses.map((good, index) => (
                  <div key={index} className="bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 text-xl">✓</span>
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

          {/* Questions to Ask */}
          {results.questions?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">❓ Questions to Ask the Landlord</h2>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <ul className="space-y-2">
                  {results.questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="text-emerald-400">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Lawyer CTA */}
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">👨‍⚖️</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Want a Professional Review?</h3>
                <p className="text-slate-400 mb-4">
                  Our partner lawyers can review your contract in detail and provide legal advice specific to your situation.
                </p>
                <ul className="text-slate-300 text-sm mb-4 space-y-1">
                  <li>✓ Detailed written analysis</li>
                  <li>✓ Response within 24-48 hours</li>
                  <li>✓ Optional video consultation</li>
                </ul>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Get Lawyer Review — 149 PLN
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={resetAnalysis}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              🔄 Analyze Another Contract
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              📥 Download Report (PDF)
            </button>
          </div>
        </div>
      ) : (
        /* Input View */
        <div>
          {/* Input Method Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setInputMethod('paste')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMethod === 'paste'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📝 Paste Text
            </button>
            <button
              onClick={() => setInputMethod('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMethod === 'upload'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📤 Upload File
            </button>
          </div>

          {/* Paste Text Input */}
          {inputMethod === 'paste' && (
            <div className="mb-6">
              <label className="block text-slate-400 text-sm mb-2">
                Paste your contract text below (Polish or English)
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the full rental contract text here... 

Tip: Copy the text from your PDF or Word document and paste it here. The more complete the contract, the better the analysis."
                rows={12}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-500"
              />
              <p className="text-slate-500 text-sm mt-2">
                {contractText.length} characters
              </p>
            </div>
          )}

          {/* File Upload */}
          {inputMethod === 'upload' && (
            <div className="mb-6">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-8 text-center transition-colors">
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-white font-medium mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-slate-500 text-sm">
                    TXT or DOC files (PDF support coming soon)
                  </p>
                </label>
              </div>
              {file && contractText && (
                <p className="text-emerald-400 text-sm mt-2">
                  ✓ File loaded - {contractText.length} characters extracted
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !contractText.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors text-lg"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing your contract...
              </span>
            ) : (
              '🔍 Analyze Contract'
            )}
          </button>

          {/* How It Works */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">📝</span>
              <h3 className="font-semibold text-white mb-2">1. Paste or Upload</h3>
              <p className="text-slate-400 text-sm">Paste your contract text or upload the file</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-semibold text-white mb-2">2. AI Analysis</h3>
              <p className="text-slate-400 text-sm">Our AI scans for red flags and unusual clauses</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">✅</span>
              <h3 className="font-semibold text-white mb-2">3. Get Results</h3>
              <p className="text-slate-400 text-sm">See what's safe and what needs attention</p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
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
