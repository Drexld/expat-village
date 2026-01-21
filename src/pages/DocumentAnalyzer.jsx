import { Link } from 'react-router-dom'
import { useState } from 'react'

function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Common document types
  const documentTypes = [
    { icon: '📋', name: 'PESEL confirmation', desc: 'Registration number document' },
    { icon: '🏠', name: 'Zameldowanie', desc: 'Address registration' },
    { icon: '📄', name: 'Residency permit', desc: 'Karta pobytu documents' },
    { icon: '💼', name: 'Work permit', desc: 'Zezwolenie na pracę' },
    { icon: '🏦', name: 'ZUS letters', desc: 'Social insurance documents' },
    { icon: '📬', name: 'Tax office letters', desc: 'Urząd Skarbowy correspondence' },
    { icon: '🏛️', name: 'City hall notices', desc: 'Urząd Miasta documents' },
    { icon: '⚖️', name: 'Court summons', desc: 'Legal documents' },
  ]

  // Simulated analysis results
  const mockResults = {
    documentType: 'ZUS Contribution Statement',
    documentTypePolish: 'Informacja o stanie konta ubezpieczonego',
    urgency: 'informational',
    urgencyLabel: 'For Your Records',
    summary: 'This is your annual ZUS statement showing your social insurance contributions for 2024. No action required - this is for your records.',
    keyInformation: [
      {
        label: 'Document Type',
        value: 'Annual contribution statement',
        icon: '📄'
      },
      {
        label: 'Period Covered',
        value: 'January 2024 - December 2024',
        icon: '📅'
      },
      {
        label: 'Total Contributions',
        value: '18,432.56 PLN',
        icon: '💰'
      },
      {
        label: 'Pension Insurance',
        value: '9,216.28 PLN (emerytalne)',
        icon: '👴'
      },
      {
        label: 'Health Insurance',
        value: '7,845.12 PLN (zdrowotne)',
        icon: '🏥'
      },
      {
        label: 'Disability Insurance',
        value: '1,371.16 PLN (rentowe)',
        icon: '🛡️'
      }
    ],
    sections: [
      {
        title: 'What This Document Is',
        content: 'This is your annual ZUS (Zakład Ubezpieczeń Społecznych) statement. ZUS is Poland\'s Social Insurance Institution - like Social Security in the US or National Insurance in the UK. Every year, they send you a summary of all contributions made on your behalf.',
        type: 'explanation'
      },
      {
        title: 'Why You Received This',
        content: 'If you work in Poland (employed or self-employed), your employer or you pay social insurance contributions monthly. This document summarizes everything paid in the previous year. It\'s sent automatically - you didn\'t do anything wrong!',
        type: 'explanation'
      },
      {
        title: 'Action Required',
        content: 'None! This is purely informational. Keep it for your records. You may need it when applying for a mortgage, visa renewal, or proving your work history.',
        type: 'action',
        actionLevel: 'none'
      },
      {
        title: 'Important Terms Explained',
        content: '',
        type: 'glossary',
        terms: [
          { polish: 'Ubezpieczenie emerytalne', english: 'Pension insurance', explanation: 'Contributions toward your retirement pension' },
          { polish: 'Ubezpieczenie rentowe', english: 'Disability insurance', explanation: 'Covers you if you become unable to work' },
          { polish: 'Ubezpieczenie zdrowotne', english: 'Health insurance', explanation: 'Gives you access to NFZ public healthcare' },
          { polish: 'Składka', english: 'Contribution', explanation: 'The amount paid to ZUS' },
          { polish: 'Płatnik', english: 'Payer', explanation: 'Usually your employer' },
        ]
      }
    ],
    relatedGuides: [
      { title: 'Understanding ZUS', path: '/get-things-done' },
      { title: 'Polish Health Insurance', path: '/insurance-health' },
    ]
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (uploadedFile) => {
    setFile(uploadedFile)
  }

  const analyzeDocument = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setResults(mockResults)
    }, 2500)
  }

  const resetAnalysis = () => {
    setFile(null)
    setResults(null)
  }

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'from-red-900/40 to-orange-900/40 border-red-700/50'
      case 'action-needed':
        return 'from-yellow-900/40 to-orange-900/40 border-yellow-700/50'
      case 'informational':
      default:
        return 'from-green-900/40 to-emerald-900/40 border-green-700/50'
    }
  }

  const getUrgencyBadgeStyle = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-600'
      case 'action-needed':
        return 'bg-yellow-600'
      case 'informational':
      default:
        return 'bg-green-600'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/get-things-done" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Get Things Done
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📄</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Document Analyzer</h1>
            <p className="text-slate-400">Understand any Polish document in plain English</p>
          </div>
        </div>
      </header>

      {!results ? (
        <>
          {/* Upload Section */}
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-900/20' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <span className="text-6xl mb-4 block">📄</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Upload Your Polish Document
                </h2>
                <p className="text-slate-400 mb-6">
                  Got a confusing letter in Polish? Upload it and we'll explain everything in plain English.
                </p>
                <label className="inline-block">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                  />
                  <span className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    Select File
                  </span>
                </label>
                <p className="text-slate-500 text-sm mt-4">
                  Supports PDF, Images (JPG, PNG), Word • Max 10MB
                </p>
              </>
            ) : (
              <>
                <span className="text-6xl mb-4 block">✅</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Document Ready
                </h2>
                <p className="text-emerald-400 mb-6">
                  📎 {file.name}
                </p>
                {!analyzing ? (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={analyzeDocument}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    >
                      🔍 Analyze Document
                    </button>
                    <button
                      onClick={() => setFile(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
                    <p className="text-emerald-400 font-medium">Reading your document...</p>
                    <p className="text-slate-500 text-sm mt-2">Translating and analyzing...</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Common Document Types */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Common Documents We Analyze</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {documentTypes.map((doc, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">{doc.icon}</span>
                  <h4 className="font-medium text-white text-sm">{doc.name}</h4>
                  <p className="text-slate-500 text-xs">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">📤</span>
              <h3 className="font-semibold text-white mb-2">1. Upload</h3>
              <p className="text-slate-400 text-sm">Take a photo or upload the PDF of your Polish document</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-semibold text-white mb-2">2. AI Explains</h3>
              <p className="text-slate-400 text-sm">We identify the document type, translate key parts, and explain what it means</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">✅</span>
              <h3 className="font-semibold text-white mb-2">3. Know What To Do</h3>
              <p className="text-slate-400 text-sm">Get clear guidance: is this urgent? Do you need to respond? What are the deadlines?</p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Your Privacy is Protected</h3>
                <p className="text-slate-400 text-sm">
                  Documents are encrypted, analyzed, and automatically deleted. We never store your personal documents 
                  or share them with third parties.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Results Section */
        <div>
          {/* Document Type & Urgency Card */}
          <div className={`rounded-xl p-6 mb-6 bg-gradient-to-r ${getUrgencyStyle(results.urgency)} border`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Document Identified As:</p>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {results.documentType}
                </h2>
                <p className="text-slate-400 text-sm italic">
                  {results.documentTypePolish}
                </p>
              </div>
              <span className={`${getUrgencyBadgeStyle(results.urgency)} text-white text-sm px-3 py-1 rounded-full`}>
                {results.urgencyLabel}
              </span>
            </div>
            <p className="text-slate-300">{results.summary}</p>
          </div>

          {/* Key Information Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Key Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.keyInformation.map((info, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{info.icon}</span>
                    <p className="text-slate-400 text-sm">{info.label}</p>
                  </div>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6 mb-8">
            {results.sections.map((section, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
                
                {section.type === 'glossary' ? (
                  <div className="space-y-3">
                    {section.terms.map((term, i) => (
                      <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-emerald-400 font-medium">{term.polish}</span>
                          <span className="text-slate-500">=</span>
                          <span className="text-white">{term.english}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{term.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : section.type === 'action' ? (
                  <div className={`rounded-lg p-4 ${
                    section.actionLevel === 'urgent' 
                      ? 'bg-red-900/30 border border-red-700/50' 
                      : section.actionLevel === 'needed'
                      ? 'bg-yellow-900/30 border border-yellow-700/50'
                      : 'bg-green-900/30 border border-green-700/50'
                  }`}>
                    <p className={`${
                      section.actionLevel === 'urgent' 
                        ? 'text-red-300' 
                        : section.actionLevel === 'needed'
                        ? 'text-yellow-300'
                        : 'text-green-300'
                    }`}>
                      {section.actionLevel === 'none' && '✅ '}{section.content}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-300">{section.content}</p>
                )}
              </div>
            ))}
          </div>

          {/* Need Professional Help */}
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌐</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Need Certified Translation?</h3>
                <p className="text-slate-300 mb-4">
                  For official purposes (visa applications, court, notary), you may need a certified sworn translation. 
                  Our partner translators can help.
                </p>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                  Get Certified Translation — from 50 PLN/page
                </button>
              </div>
            </div>
          </div>

          {/* Related Guides */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">📚 Related Guides</h3>
            <div className="flex flex-wrap gap-3">
              {results.relatedGuides.map((guide, index) => (
                <Link
                  key={index}
                  to={guide.path}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {guide.title} →
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition-colors">
              📥 Download Explanation (PDF)
            </button>
            <button 
              onClick={resetAnalysis}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Analyze Another Document
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors">
              📤 Share
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentAnalyzer
