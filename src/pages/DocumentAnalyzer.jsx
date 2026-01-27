// src/pages/DocumentAnalyzer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzeDocument } from '../lib/groq'

function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const commonDocTypes = [
    { icon: '📋', name: 'ZUS Letter', desc: 'Social security documents' },
    { icon: '💰', name: 'Tax Notice', desc: 'PIT, VAT, or tax office letters' },
    { icon: '🏠', name: 'Residency Card', desc: 'Karta pobytu decisions' },
    { icon: '🏛️', name: 'Urząd Letter', desc: 'Government office notices' },
    { icon: '⚡', name: 'Utility Bill', desc: 'Electricity, gas, water' },
    { icon: '🏦', name: 'Bank Document', desc: 'Account statements, notices' },
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
    if (urgency?.includes('URGENT')) return 'bg-red-600 text-white'
    if (urgency?.includes('ACTION')) return 'bg-amber-600 text-white'
    return 'bg-emerald-600 text-white'
  }

  const getUrgencyIcon = (urgency) => {
    if (urgency?.includes('URGENT')) return '🚨'
    if (urgency?.includes('ACTION')) return '⚡'
    return '📄'
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
    <div>
      <nav className="mb-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📄</span>
          <h1 className="text-3xl font-bold text-white">Document Analyzer</h1>
          <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
        </div>
        <p className="text-slate-400 text-lg">
          Got a confusing Polish letter? Paste it here and we'll explain what it means in plain English.
        </p>
      </header>

      {/* Results View */}
      {results ? (
        <div>
          {/* Document Type Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Document Type</p>
                <h2 className="text-2xl font-bold text-white">{results.documentType}</h2>
                {results.polishName && (
                  <p className="text-slate-400 text-sm italic">{results.polishName}</p>
                )}
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium text-sm ${getUrgencyStyle(results.urgency)}`}>
                {getUrgencyIcon(results.urgency)} {results.urgency}
              </div>
            </div>
            <p className="text-slate-300 text-lg">{results.summary}</p>
          </div>

          {/* Key Information */}
          {results.keyInformation?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Key Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.keyInformation.map((info, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-400 text-sm">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What It Means */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">💡 What This Means</h3>
            <p className="text-slate-300 whitespace-pre-line">{results.whatItMeans}</p>
          </div>

          {/* Action Required */}
          {results.actionRequired && (
            <div className={`rounded-xl p-6 mb-6 ${
              results.urgency?.includes('URGENT') 
                ? 'bg-red-900/30 border border-red-700/50' 
                : results.urgency?.includes('ACTION')
                ? 'bg-amber-900/30 border border-amber-700/50'
                : 'bg-emerald-900/30 border border-emerald-700/50'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4">
                {results.urgency?.includes('URGENT') ? '🚨' : '📋'} What You Need To Do
              </h3>
              <p className="text-slate-300">{results.actionRequired}</p>
              {results.deadline && (
                <div className="mt-4 bg-slate-800/50 rounded-lg p-3 inline-block">
                  <p className="text-slate-400 text-sm">Deadline</p>
                  <p className="text-white font-semibold">{results.deadline}</p>
                </div>
              )}
            </div>
          )}

          {/* Polish Terms */}
          {results.polishTerms?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">🇵🇱 Polish Terms Explained</h3>
              <div className="space-y-3">
                {results.polishTerms.map((term, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-emerald-400 font-medium">{term.term}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-white">{term.translation}</span>
                    </div>
                    {term.explanation && (
                      <p className="text-slate-400 text-sm">{term.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {results.nextSteps?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">👣 Next Steps</h3>
              <ol className="space-y-2">
                {results.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Related Guides */}
          {results.relatedGuides?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">📚 Related Guides</h3>
              <div className="flex flex-wrap gap-2">
                {results.relatedGuides.map((guide, index) => {
                  const linkPath = Object.entries(guideLinks).find(([key]) => 
                    guide.toLowerCase().includes(key.toLowerCase())
                  )?.[1] || '/get-things-done'
                  
                  return (
                    <Link
                      key={index}
                      to={linkPath}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-4 py-2 rounded-lg transition-colors"
                    >
                      {guide} →
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Translation CTA */}
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">📜</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Need Certified Translation?</h3>
                <p className="text-slate-400 mb-4">
                  For visa applications, court proceedings, or official purposes, you may need a sworn translation.
                </p>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Get Certified Translation — from 50 PLN/page
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
              🔄 Analyze Another Document
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              📥 Download Explanation (PDF)
            </button>
          </div>
        </div>
      ) : (
        /* Input View */
        <div>
          {/* Common Document Types */}
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-3">Common document types we can help with:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonDocTypes.map((doc, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
                  <span className="text-2xl">{doc.icon}</span>
                  <p className="text-white text-sm font-medium mt-1">{doc.name}</p>
                  <p className="text-slate-500 text-xs">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2">
              Paste the document text below (in Polish)
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste the Polish text from your document here...

Tip: You can type out text from a physical letter, or copy text from a PDF. Include as much of the document as possible for the best analysis."
              rows={10}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-500"
            />
            <p className="text-slate-500 text-sm mt-2">
              {documentText.length} characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !documentText.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors text-lg"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing your document...
              </span>
            ) : (
              '🔍 Analyze Document'
            )}
          </button>

          {/* How It Works */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">📝</span>
              <h3 className="font-semibold text-white mb-2">1. Paste Text</h3>
              <p className="text-slate-400 text-sm">Copy the Polish text from your document</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-semibold text-white mb-2">2. AI Translation</h3>
              <p className="text-slate-400 text-sm">We identify the document type and translate it</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">✅</span>
              <h3 className="font-semibold text-white mb-2">3. Get Explanation</h3>
              <p className="text-slate-400 text-sm">Understand what it means and what to do</p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Your Privacy is Protected</h3>
                <p className="text-slate-400 text-sm">
                  Your document text is sent securely for analysis and is not stored. 
                  We recommend removing personal details like PESEL if you're concerned.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentAnalyzer
