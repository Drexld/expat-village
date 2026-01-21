import { Link } from 'react-router-dom'
import { useState } from 'react'

function ContractAnalyzer() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Simulated analysis results for demo
  const mockResults = {
    overallScore: 72,
    verdict: 'Proceed with Caution',
    verdictColor: 'yellow',
    summary: 'This contract has some unusual clauses that you should discuss with your landlord before signing. Nothing deal-breaking, but clarification is recommended.',
    clauses: [
      {
        id: 1,
        type: 'red',
        title: 'Entry Without Notice',
        original: 'Wynajmujący ma prawo wejść do lokalu w każdym czasie...',
        translation: 'The landlord has the right to enter the premises at any time...',
        issue: 'Polish law requires 24-hour notice before landlord entry except emergencies. This clause attempts to waive that right.',
        recommendation: 'Request modification to include 24-hour notice requirement.',
        severity: 'high'
      },
      {
        id: 2,
        type: 'yellow',
        title: 'Deposit Amount',
        original: 'Kaucja wynosi równowartość 3 miesięcznych czynszów...',
        translation: 'The deposit equals 3 months rent...',
        issue: 'While legal, 3-month deposits are above typical (1-2 months). This ties up significant funds.',
        recommendation: 'Negotiate down to 2 months if possible, or ensure clear return conditions.',
        severity: 'medium'
      },
      {
        id: 3,
        type: 'yellow',
        title: 'Renovation Restrictions',
        original: 'Najemca nie może dokonywać żadnych zmian w lokalu...',
        translation: 'The tenant cannot make any changes to the premises...',
        issue: 'Very broad restriction - could include hanging pictures or minor adjustments.',
        recommendation: 'Ask for clarification on what modifications are allowed (painting, shelving, etc.).',
        severity: 'medium'
      },
      {
        id: 4,
        type: 'green',
        title: 'Lease Duration',
        original: 'Umowa zawarta na czas określony 12 miesięcy...',
        translation: 'Contract signed for a fixed period of 12 months...',
        issue: null,
        recommendation: 'Standard 12-month lease. Good for stability.',
        severity: 'none'
      },
      {
        id: 5,
        type: 'green',
        title: 'Notice Period',
        original: 'Okres wypowiedzenia wynosi 2 miesiące...',
        translation: '2-month notice period...',
        issue: null,
        recommendation: 'Standard notice period. Fair for both parties.',
        severity: 'none'
      },
      {
        id: 6,
        type: 'yellow',
        title: 'Utility Payments',
        original: 'Najemca zobowiązuje się do płacenia czynszu administracyjnego...',
        translation: 'Tenant agrees to pay administrative rent (czynsz administracyjny)...',
        issue: 'Amount not specified in contract. Could vary month to month.',
        recommendation: 'Request a cap or average estimate in writing.',
        severity: 'medium'
      },
      {
        id: 7,
        type: 'red',
        title: 'Penalty Clause',
        original: 'W przypadku wcześniejszego rozwiązania umowy, najemca zapłaci karę...',
        translation: 'In case of early termination, tenant will pay a penalty...',
        issue: 'Penalty equals 3 months rent for early termination. This is very high and may not be enforceable.',
        recommendation: 'Negotiate down or remove. Excessive penalties may not hold up legally.',
        severity: 'high'
      }
    ],
    quickStats: {
      redFlags: 2,
      warnings: 3,
      okClauses: 2,
      totalClauses: 7
    }
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

  const analyzeContract = () => {
    setAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false)
      setResults(mockResults)
    }, 3000)
  }

  const resetAnalysis = () => {
    setFile(null)
    setResults(null)
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/housing" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Housing
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📝</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Contract Analyzer</h1>
            <p className="text-slate-400">AI-powered rental contract review</p>
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
                  Upload Your Rental Contract
                </h2>
                <p className="text-slate-400 mb-6">
                  Drag & drop your PDF or click to browse. We'll analyze it for red flags.
                </p>
                <label className="inline-block">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                  />
                  <span className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    Select File
                  </span>
                </label>
                <p className="text-slate-500 text-sm mt-4">
                  Supports PDF, DOC, DOCX • Max 10MB
                </p>
              </>
            ) : (
              <>
                <span className="text-6xl mb-4 block">✅</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  File Ready
                </h2>
                <p className="text-emerald-400 mb-6">
                  📎 {file.name}
                </p>
                {!analyzing ? (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={analyzeContract}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    >
                      🔍 Analyze Contract
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
                    <p className="text-emerald-400 font-medium">Analyzing your contract...</p>
                    <p className="text-slate-500 text-sm mt-2">This usually takes 10-30 seconds</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* How It Works */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">📤</span>
              <h3 className="font-semibold text-white mb-2">1. Upload</h3>
              <p className="text-slate-400 text-sm">Upload your rental contract in PDF or Word format</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-semibold text-white mb-2">2. AI Analysis</h3>
              <p className="text-slate-400 text-sm">Our AI scans for red flags, unusual clauses, and missing protections</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <span className="text-3xl mb-3 block">⚖️</span>
              <h3 className="font-semibold text-white mb-2">3. Get Expert Review</h3>
              <p className="text-slate-400 text-sm">Optional: Have a real lawyer review for complete peace of mind</p>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Your Privacy is Protected</h3>
                <p className="text-slate-400 text-sm">
                  Contracts are encrypted and automatically deleted after analysis. 
                  We never share your documents with third parties without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Results Section */
        <div>
          {/* Score Card */}
          <div className={`rounded-xl p-6 mb-6 ${
            results.verdictColor === 'green' 
              ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/50'
              : results.verdictColor === 'yellow'
              ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-700/50'
              : 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-700/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Score: {results.overallScore}/100
                </h2>
                <p className={`text-lg font-medium ${
                  results.verdictColor === 'green' ? 'text-green-400' :
                  results.verdictColor === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {results.verdict}
                </p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-red-400">{results.quickStats.redFlags}</p>
                  <p className="text-xs text-slate-400">Red Flags</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{results.quickStats.warnings}</p>
                  <p className="text-xs text-slate-400">Warnings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{results.quickStats.okClauses}</p>
                  <p className="text-xs text-slate-400">OK</p>
                </div>
              </div>
            </div>
            <p className="text-slate-300">{results.summary}</p>
          </div>

          {/* Lawyer CTA */}
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚖️</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Want 100% Certainty?</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-slate-300 mb-4">
                  Our partner lawyers specialize in Polish rental law. Get a detailed written review 
                  with specific advice for negotiating this contract.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                    👨‍⚖️ Get Lawyer Review — 149 PLN
                  </button>
                  <div className="text-slate-400 text-sm">
                    <p>✓ Written report within 24-48 hours</p>
                    <p>✓ Specific negotiation advice</p>
                    <p>✓ Optional video call available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Clauses */}
          <h3 className="text-xl font-bold text-white mb-4">Clause-by-Clause Analysis</h3>
          <div className="space-y-4 mb-8">
            {results.clauses.map((clause) => (
              <div 
                key={clause.id}
                className={`border rounded-xl p-5 ${
                  clause.type === 'red' 
                    ? 'bg-red-900/20 border-red-700/50' 
                    : clause.type === 'yellow'
                    ? 'bg-yellow-900/20 border-yellow-700/50'
                    : 'bg-green-900/20 border-green-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      clause.type === 'red' ? 'bg-red-500' :
                      clause.type === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                    <h4 className="font-semibold text-white">{clause.title}</h4>
                    {clause.severity === 'high' && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">High Priority</span>
                    )}
                  </div>
                </div>
                
                {/* Original Polish */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-slate-500 text-xs mb-1">Original (Polish):</p>
                  <p className="text-slate-400 text-sm italic">"{clause.original}"</p>
                </div>
                
                {/* Translation */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-slate-500 text-xs mb-1">Translation:</p>
                  <p className="text-slate-300 text-sm">"{clause.translation}"</p>
                </div>
                
                {/* Issue & Recommendation */}
                {clause.issue && (
                  <div className={`rounded-lg p-3 mb-3 ${
                    clause.type === 'red' ? 'bg-red-900/30' : 'bg-yellow-900/30'
                  }`}>
                    <p className={`text-sm font-medium ${
                      clause.type === 'red' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      ⚠️ Issue: {clause.issue}
                    </p>
                  </div>
                )}
                
                <div className={`rounded-lg p-3 ${
                  clause.type === 'green' ? 'bg-green-900/30' : 'bg-slate-800/50'
                }`}>
                  <p className={`text-sm ${clause.type === 'green' ? 'text-green-400' : 'text-slate-300'}`}>
                    💡 {clause.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition-colors">
              📥 Download Report (PDF)
            </button>
            <button 
              onClick={resetAnalysis}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔄 Analyze Another Contract
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors">
              📤 Share Results
            </button>
          </div>

          {/* Questions Generator */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">❓ Questions to Ask Your Landlord</h3>
            <p className="text-slate-400 text-sm mb-4">Based on the issues found, here are specific questions you should ask:</p>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <span className="text-emerald-400">1.</span>
                "Can we add a 24-hour notice requirement before you enter the apartment?"
              </li>
              <li className="flex gap-2 text-slate-300">
                <span className="text-emerald-400">2.</span>
                "Would you consider reducing the deposit to 2 months instead of 3?"
              </li>
              <li className="flex gap-2 text-slate-300">
                <span className="text-emerald-400">3.</span>
                "What is the typical monthly czynsz administracyjny amount?"
              </li>
              <li className="flex gap-2 text-slate-300">
                <span className="text-emerald-400">4.</span>
                "Can we reduce the early termination penalty or add exceptions?"
              </li>
            </ul>
          </div>

          {/* Final Lawyer CTA */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Still Not Sure?</h3>
            <p className="text-slate-400 mb-4">
              A lawyer review is the safest way to protect yourself. They'll catch things AI might miss.
            </p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg transition-colors font-medium">
              👨‍⚖️ Get Professional Lawyer Review — 149 PLN
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractAnalyzer
