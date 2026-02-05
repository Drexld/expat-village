// src/pages/DocumentAnalyzer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzeDocument } from '../lib/groq'
import Icon from '../components/Icon'

function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const commonDocTypes = [
    { icon: 'document', name: 'ZUS Letter', desc: 'Social security documents' },
    { icon: 'briefcase', name: 'Tax Notice', desc: 'PIT, VAT, or tax office letters' },
    { icon: 'home', name: 'Residency Card', desc: 'Karta pobytu decisions' },
    { icon: 'building', name: 'Urzad Letter', desc: 'Government office notices' },
    { icon: 'bolt', name: 'Utility Bill', desc: 'Electricity, gas, water' },
    { icon: 'chart', name: 'Bank Document', desc: 'Account statements, notices' },
  ]

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError('Please paste the document text')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysis = await analyzeDocument(documentText)
      setResults(analysis)
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze document. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setDocumentText('')
    setResults(null)
    setError(null)
  }

  const getUrgencyStyle = (urgency) => {
    if (urgency?.includes('URGENT')) return 'bg-red-500/80 text-white'
    if (urgency?.includes('ACTION')) return 'bg-amber-500/80 text-white'
    return 'bg-emerald-500/80 text-white'
  }

  const getUrgencyIcon = (urgency) => {
    if (urgency?.includes('URGENT')) return 'alert'
    if (urgency?.includes('ACTION')) return 'warning'
    return 'document'
  }

  const guideLinks = {
    'PESEL': '/get-things-done',
    'ZUS': '/get-things-done',
    'Residency': '/get-things-done',
    'Tax': '/get-things-done',
    'Bank': '/get-things-done',
    'NFZ': '/insurance-health',
    'Health': '/insurance-health',
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
          <h1 className="text-3xl font-semibold text-white">Document Analyzer</h1>
          <span className="glass-chip text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
        </div>
        <p className="text-slate-400 text-lg">
          Got a confusing Polish letter? Paste it here and we will explain what it means in plain English.
        </p>
      </header>

      {results ? (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Document Type</p>
                <h2 className="text-2xl font-bold text-white">{results.documentType}</h2>
                {results.polishName && (
                  <p className="text-slate-400 text-sm italic">{results.polishName}</p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium text-sm flex items-center gap-2 ${getUrgencyStyle(results.urgency)}`}>
                <Icon name={getUrgencyIcon(results.urgency)} size={14} className="text-white" />
                {results.urgency}
              </div>
            </div>
            <p className="text-slate-300 text-lg">{results.summary}</p>
          </div>

          {results.keyInformation?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="chart" size={18} className="text-slate-200" />
                Key Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.keyInformation.map((info, index) => (
                  <div key={index} className="glass-chip rounded-lg p-3">
                    <p className="text-slate-400 text-sm">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="info" size={18} className="text-slate-200" />
              What This Means
            </h3>
            <p className="text-slate-300 whitespace-pre-line">{results.whatItMeans}</p>
          </div>

          {results.actionRequired && (
            <div className={`rounded-2xl p-6 ${
              results.urgency?.includes('URGENT')
                ? 'glass-panel border border-red-500/30'
                : results.urgency?.includes('ACTION')
                ? 'glass-panel border border-amber-500/30'
                : 'glass-panel border border-emerald-500/30'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name={results.urgency?.includes('URGENT') ? 'alert' : 'document'} size={18} className="text-slate-200" />
                What You Need To Do
              </h3>
              <p className="text-slate-300">{results.actionRequired}</p>
              {results.deadline && (
                <div className="mt-4 glass-chip rounded-lg p-3 inline-block">
                  <p className="text-slate-400 text-sm">Deadline</p>
                  <p className="text-white font-semibold">{results.deadline}</p>
                </div>
              )}
            </div>
          )}

          {results.polishTerms?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="globe" size={18} className="text-slate-200" />
                Polish Terms Explained
              </h3>
              <div className="space-y-3">
                {results.polishTerms.map((term, index) => (
                  <div key={index} className="glass-chip rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-emerald-200 font-medium">{term.term}</span>
                      <span className="text-slate-500">-</span>
                      <span className="text-slate-300 text-sm">{term.translation}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{term.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.nextSteps?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="arrowRight" size={18} className="text-slate-200" />
                Next Steps
              </h3>
              <ul className="space-y-2">
                {results.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300">
                    <Icon name="success" size={14} className="text-emerald-200 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.relatedGuides?.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="book" size={18} className="text-slate-200" />
                Related Guides
              </h3>
              <div className="space-y-2">
                {results.relatedGuides.map((guide, index) => (
                  <Link
                    key={index}
                    to={guideLinks[guide] || '/get-things-done'}
                    className="glass-chip rounded-lg p-3 flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>{guide}</span>
                    <Icon name="arrowRight" size={16} className="text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="shield" size={20} className="text-slate-100" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Need a Certified Translation?</h3>
                <p className="text-slate-400 mb-4">
                  Our partner translators can provide a certified translation with official stamps.
                </p>
                <button className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Get Certified Translation - from 50 PLN/page
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={resetAnalysis}
              className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Analyze Another Document
            </button>
            <button className="glass-chip text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Download Explanation (PDF)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white mb-3">Common Document Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonDocTypes.map((doc) => (
                <div key={doc.name} className="glass-chip rounded-xl p-4 flex items-center gap-3">
                  <Icon name={doc.icon} size={18} className="text-slate-200" />
                  <div>
                    <p className="text-white font-medium">{doc.name}</p>
                    <p className="text-slate-400 text-sm">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Paste the document text below (Polish or English)
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste the full document text here...\n\nTip: The more complete the document, the better the explanation."
              rows={12}
              className="w-full glass-panel border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-slate-400"
            />
            <p className="text-slate-500 text-sm mt-2">
              {documentText.length} characters
            </p>
          </div>

          {error && (
            <div className="glass-panel border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !documentText.trim()}
            className="w-full glass-strong disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-colors text-lg"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing your document...
              </span>
            ) : (
              'Analyze Document'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default DocumentAnalyzer
