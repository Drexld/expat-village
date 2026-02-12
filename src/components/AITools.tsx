import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, AlertCircle, CheckCircle, Brain, Share2, Users, X, Edit3, AlertTriangle, Info, Scale, ShieldCheck, Clock3 } from 'lucide-react';
import { toast } from 'sonner';

type Severity = 'high' | 'medium' | 'low';

interface ContractIssue {
  severity: Severity;
  title: string;
  description: string;
  suggestion: string;
  location: string;
  legalReference: string;
}

interface LegalCheck {
  title: string;
  status: 'pass' | 'review' | 'missing';
  detail: string;
  legalReference: string;
}

interface ContractAnalysisResult {
  score: number;
  issues: ContractIssue[];
  positives: string[];
  warsawTips: string[];
  legalChecks: LegalCheck[];
}

export function AITools() {
  const [activeTab, setActiveTab] = useState<'contract' | 'document' | 'nestquest'>('contract');
  const [analyzing, setAnalyzing] = useState(false);
  const [contractResults, setContractResults] = useState<ContractAnalysisResult | null>(null);
  const [documentResults, setDocumentResults] = useState<any>(null);
  const [editingClause, setEditingClause] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [requestingLawyer, setRequestingLawyer] = useState(false);
  const [lawyerForm, setLawyerForm] = useState({
    email: '',
    priority: 'standard',
    note: '',
  });

  const handleFileUpload = (type: 'contract' | 'document') => {
    setAnalyzing(true);
    
    toast.info('🧠 AI analyzing...', {
      description: 'This may take a few seconds',
      duration: 2000,
    });

    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      
      if (type === 'contract') {
        setContractResults({
          score: 75,
          issues: [
            {
              severity: 'high',
              title: 'No registration clause found',
              description: 'Contract lacks clause requiring landlord to register tenancy - common scam in Warsaw',
              suggestion: 'Add: "Landlord agrees to register this tenancy with tax authorities within 14 days"',
              location: 'Section 3.2',
              legalReference: 'Polish tax-registration duties for rental income (landlord side)'
            },
            {
              severity: 'medium',
              title: 'Deposit terms unclear',
              description: 'Return conditions not specified',
              suggestion: 'Specify: "Deposit returned within 30 days after move-out, minus documented damages"',
              location: 'Section 5.1',
              legalReference: 'Civil Code fairness principle for clear obligations'
            },
            {
              severity: 'low',
              title: 'Utilities payment method',
              description: 'Could be more specific about billing cycle',
              suggestion: 'Consider monthly pre-payment system',
              location: 'Section 6',
              legalReference: 'Consumer transparency practice for recurring charges'
            }
          ],
          positives: [
            'Clear rent amount and payment dates',
            'Proper notice period specified',
            'Maintenance responsibilities defined'
          ],
          warsawTips: [
            'In Warsaw, landlords must register tenancy or face fines',
            'Average security deposit is 1-2 months rent',
            'Utilities usually average 400-600 PLN/month for studio'
          ],
          legalChecks: [
            {
              title: 'Landlord identity and ownership traceability',
              status: 'review',
              detail: 'No explicit ownership verification clause was found.',
              legalReference: 'Polish Civil Code due-diligence best practice'
            },
            {
              title: 'Deposit return and damage deduction terms',
              status: 'review',
              detail: 'Deposit process exists but timeline and evidence requirements are vague.',
              legalReference: 'Contract clarity requirement under Civil Code principles'
            },
            {
              title: 'Termination and notice clauses',
              status: 'pass',
              detail: 'Termination window appears defined and bilateral.',
              legalReference: 'General contractual balance standards'
            },
            {
              title: 'Utilities and additional charges transparency',
              status: 'missing',
              detail: 'No detailed monthly settlement method or invoice evidence path.',
              legalReference: 'Consumer-rights transparency expectations'
            }
          ]
        });

        toast.success('✅ Analysis complete!', {
          description: 'Found 3 issues to review',
          duration: 3000,
        });
      } else {
        setDocumentResults({
          urgency: 'medium',
          type: 'Tax Office Notice',
          summary: 'This is a notice about your upcoming tax filing deadline',
          actionRequired: true,
          deadline: 'April 30, 2026',
          keyPoints: [
            'Annual tax return (PIT) must be filed',
            'If employed, employer may have already filed for you',
            'Check your e-PIT account online',
            'Deadline: April 30, 2026'
          ],
          nextSteps: [
            {
              step: 'Check e-PIT system',
              link: 'https://www.podatki.gov.pl',
              priority: 'high'
            },
            {
              step: 'Gather income documents',
              priority: 'medium'
            },
            {
              step: 'Consult tax advisor if complex',
              priority: 'low'
            }
          ],
          translation: 'Full English translation available',
          relatedGuide: 'Polish Tax System for Expats'
        });

        toast.success('✅ Document analyzed!', {
          description: 'Action required by April 30',
          duration: 3000,
        });
      }
    }, 3000);
  };

  const handleWhatIfSimulator = () => {
    toast.info('🔮 What-If Simulator', {
      description: 'Edit clause below and tap Re-analyze',
      duration: 2000,
    });
    setEditingClause(true);
  };

  const handleShareWithForum = () => {
    toast.success('📤 Shared with forum!', {
      description: 'Expat lawyers will review within 24h',
      duration: 2000,
    });
  };

  const handleContactLawyer = () => {
    setShowLawyerModal(true);
  };

  const handleSubmitLawyerRequest = () => {
    if (!lawyerForm.email.trim() || !lawyerForm.email.includes('@')) {
      toast.error('Enter a valid email for lawyer follow-up');
      return;
    }

    setRequestingLawyer(true);
    setTimeout(() => {
      setRequestingLawyer(false);
      setShowLawyerModal(false);
      toast.success('Lawyer review requested', {
        description: 'A verified Warsaw lawyer will review flagged clauses and contact you.',
        duration: 3000,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Brain className="w-7 h-7 text-[#8b5cf6]" strokeWidth={2} />
            AI Tools
          </h1>
          <p className="text-sm text-white/50">Analyze before you sign or act</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('contract')}
            className={`relative rounded-[16px] p-[1px] transition-all ${
              activeTab === 'contract'
                ? 'bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed]'
                : 'bg-gradient-to-b from-white/10 to-white/5'
            }`}
          >
            <div className={`relative rounded-[16px] p-3 transition-all ${
              activeTab === 'contract'
                ? 'bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] shadow-[0_4px_20px_rgba(139,92,246,0.4)]'
                : 'bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90'
            }`}>
              <FileText className={`w-5 h-5 mx-auto mb-1 ${activeTab === 'contract' ? 'text-white' : 'text-white/50'}`} strokeWidth={2} />
              <p className={`text-xs font-semibold text-center ${activeTab === 'contract' ? 'text-white' : 'text-white/50'}`}>
                Contract
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('document')}
            className={`relative rounded-[16px] p-[1px] transition-all ${
              activeTab === 'document'
                ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2]'
                : 'bg-gradient-to-b from-white/10 to-white/5'
            }`}
          >
            <div className={`relative rounded-[16px] p-3 transition-all ${
              activeTab === 'document'
                ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] shadow-[0_4px_20px_rgba(59,158,255,0.4)]'
                : 'bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90'
            }`}>
              <AlertCircle className={`w-5 h-5 mx-auto mb-1 ${activeTab === 'document' ? 'text-white' : 'text-white/50'}`} strokeWidth={2} />
              <p className={`text-xs font-semibold text-center ${activeTab === 'document' ? 'text-white' : 'text-white/50'}`}>
                Document
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('nestquest')}
            className={`relative rounded-[16px] p-[1px] transition-all ${
              activeTab === 'nestquest'
                ? 'bg-gradient-to-b from-[#10b981] to-[#059669]'
                : 'bg-gradient-to-b from-white/10 to-white/5'
            }`}
          >
            <div className={`relative rounded-[16px] p-3 transition-all ${
              activeTab === 'nestquest'
                ? 'bg-gradient-to-b from-[#10b981] to-[#059669] shadow-[0_4px_20px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90'
            }`}>
              <span className={`text-xl mx-auto block mb-1 ${activeTab === 'nestquest' ? 'opacity-100' : 'opacity-50'}`}>🏠</span>
              <p className={`text-xs font-semibold text-center ${activeTab === 'nestquest' ? 'text-white' : 'text-white/50'}`}>
                NestQuest
              </p>
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-[8px] font-bold text-white">
                FREE
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-24">
        {/* Contract Analyzer */}
        {activeTab === 'contract' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Upload Section */}
            {!contractResults && (
              <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
                <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                  
                  <div className="relative text-center">
                    <button
                      onClick={() => handleFileUpload('contract')}
                      disabled={analyzing}
                      className="w-full aspect-square rounded-[20px] border-2 border-dashed border-[#8b5cf6]/30 hover:border-[#8b5cf6]/50 transition-colors flex flex-col items-center justify-center gap-4 mb-4"
                    >
                      {analyzing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-16 h-16 text-[#8b5cf6]" strokeWidth={1.5} />
                        </motion.div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-[#8b5cf6]/70" strokeWidth={1.5} />
                          <div>
                            <p className="text-lg font-semibold mb-1">Upload Contract</p>
                            <p className="text-sm text-white/50">PDF, DOC, or photo</p>
                          </div>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-white/40 leading-relaxed">
                      AI screens clauses against Polish law expectations and Warsaw rental red flags.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {contractResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Score Card */}
                <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
                  <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">Contract Score</h3>
                      <button
                        onClick={() => setContractResults(null)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold bg-gradient-to-r from-[#f59e0b] to-[#f59e0b] bg-clip-text text-transparent mb-2">
                        {contractResults.score}/100
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3b9eff]/15 border border-[#3b9eff]/30 mb-2">
                        <Scale className="w-3.5 h-3.5 text-[#3b9eff]" strokeWidth={2} />
                        <span className="text-[10px] font-semibold text-[#3b9eff] uppercase">Polish Law Mode</span>
                      </div>
                      <p className="text-sm text-white/60">
                        {contractResults.score >= 80 ? 'Good contract' : 
                         contractResults.score >= 60 ? 'Needs improvements' : 
                         'Serious issues found'}
                      </p>
                      <p className="text-[11px] text-white/45 mt-1">
                        Preliminary AI screening. Not a substitute for legal advice.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleWhatIfSimulator}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 text-xs font-semibold text-[#8b5cf6] transition-all"
                      >
                        <Edit3 className="w-4 h-4" strokeWidth={2} />
                        What-If
                      </button>
                      <button
                        onClick={handleShareWithForum}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold transition-all"
                      >
                        <Share2 className="w-4 h-4" strokeWidth={2} />
                        Share
                      </button>
                      <button
                        onClick={handleContactLawyer}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-all"
                      >
                        <Scale className="w-4 h-4" strokeWidth={2} />
                        Lawyer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                <div>
                  <h3 className="font-bold mb-3">Clauses Requiring Review ({contractResults.issues.length})</h3>
                  <div className="space-y-3">
                    {contractResults.issues.map((issue, index: number) => (
                      <div
                        key={index}
                        className={`relative rounded-[16px] p-[1px] ${
                          issue.severity === 'high' ? 'bg-gradient-to-b from-red-500/30 to-red-600/10' :
                          issue.severity === 'medium' ? 'bg-gradient-to-b from-amber-500/30 to-amber-600/10' :
                          'bg-gradient-to-b from-white/20 to-white/5'
                        }`}
                      >
                        <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              issue.severity === 'high' ? 'bg-red-500/20' :
                              issue.severity === 'medium' ? 'bg-amber-500/20' :
                              'bg-white/10'
                            }`}>
                              <AlertTriangle className={`w-5 h-5 ${
                                issue.severity === 'high' ? 'text-red-400' :
                                issue.severity === 'medium' ? 'text-amber-400' :
                                'text-white/50'
                              }`} strokeWidth={2} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{issue.title}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  issue.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                  issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-white/10 text-white/50'
                                }`}>
                                  {issue.severity}
                                </span>
                              </div>
                              <p className="text-xs text-white/60 mb-2 leading-relaxed">{issue.description}</p>
                              
                              <div className="p-2 rounded-lg bg-green-500/10 border border-green-400/20 mb-2">
                                <p className="text-xs text-green-400 leading-relaxed">
                                  <span className="font-semibold">Suggestion:</span> {issue.suggestion}
                                </p>
                              </div>

                              <p className="text-[10px] text-white/40">Location: {issue.location}</p>
                              <p className="text-[10px] text-[#3b9eff]/75 mt-1">Legal basis: {issue.legalReference}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Good Clauses */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-green-500/30 to-green-600/10">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-400" strokeWidth={2} />
                      Good Clauses Detected
                    </h3>
                    <ul className="space-y-2">
                      {contractResults.positives.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-white/80 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Polish Law Checks */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#8b5cf6]/10">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                      Polish Law Checks
                    </h3>
                    <div className="space-y-2.5">
                      {contractResults.legalChecks.map((check, index: number) => (
                        <div key={index} className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              check.status === 'pass'
                                ? 'bg-green-500/20 text-green-400'
                                : check.status === 'review'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}>
                              {check.status}
                            </span>
                            <p className="text-sm font-semibold">{check.title}</p>
                          </div>
                          <p className="text-xs text-white/65 leading-relaxed">{check.detail}</p>
                          <p className="text-[10px] text-[#3b9eff]/70 mt-1.5">Legal basis: {check.legalReference}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Warsaw-Specific Tips */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-amber-400/30 to-amber-500/10">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-400" strokeWidth={2} />
                      Warsaw Tips
                    </h3>
                    <ul className="space-y-2">
                      {contractResults.warsawTips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span className="flex-1">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact Lawyer Card */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center">
                        <Scale className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Request Human Lawyer Review</h4>
                        <p className="text-xs text-white/50">Send this contract for manual review by a verified Warsaw lawyer.</p>
                      </div>
                      <button
                        onClick={handleContactLawyer}
                        className="px-4 py-2 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-all"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Document Analyzer */}
        {activeTab === 'document' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Upload Section */}
            {!documentResults && (
              <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
                <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                  
                  <div className="relative text-center">
                    <button
                      onClick={() => handleFileUpload('document')}
                      disabled={analyzing}
                      className="w-full aspect-square rounded-[20px] border-2 border-dashed border-[#3b9eff]/30 hover:border-[#3b9eff]/50 transition-colors flex flex-col items-center justify-center gap-4 mb-4"
                    >
                      {analyzing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-16 h-16 text-[#3b9eff]" strokeWidth={1.5} />
                        </motion.div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-[#3b9eff]/70" strokeWidth={1.5} />
                          <div>
                            <p className="text-lg font-semibold mb-1">Upload Document</p>
                            <p className="text-sm text-white/50">Government letters, forms, notices</p>
                          </div>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-white/40 leading-relaxed">
                      AI will translate, explain urgency, and tell you what action is needed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {documentResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Urgency Card */}
                <div className={`relative rounded-[24px] p-[1px] ${
                  documentResults.urgency === 'high' ? 'bg-gradient-to-b from-red-500/40 to-red-600/20' :
                  documentResults.urgency === 'medium' ? 'bg-gradient-to-b from-amber-500/40 to-amber-600/20' :
                  'bg-gradient-to-b from-green-500/40 to-green-600/20'
                }`}>
                  <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">Document Analysis</h3>
                      <button
                        onClick={() => setDocumentResults(null)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-full ${
                        documentResults.urgency === 'high' ? 'bg-red-500/20' :
                        documentResults.urgency === 'medium' ? 'bg-amber-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <AlertCircle className={`w-6 h-6 ${
                          documentResults.urgency === 'high' ? 'text-red-400' :
                          documentResults.urgency === 'medium' ? 'text-amber-400' :
                          'text-green-400'
                        }`} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1">Document Type</p>
                        <p className="text-lg font-bold">{documentResults.type}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                        documentResults.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                        documentResults.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {documentResults.urgency} Priority
                      </span>
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      {documentResults.summary}
                    </p>

                    {documentResults.actionRequired && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                        <p className="text-sm font-semibold text-amber-400 mb-1">Action Required</p>
                        <p className="text-xs text-white/70">Deadline: {documentResults.deadline}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Points */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <h3 className="font-bold mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {documentResults.keyPoints.map((point: string, index: number) => (
                        <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#3b9eff] mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <span className="flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <h3 className="font-bold mb-3">Next Steps</h3>
                    <div className="space-y-2">
                      {documentResults.nextSteps.map((step: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <span className="w-6 h-6 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{step.step}</p>
                            {step.link && (
                              <a href={step.link} className="text-xs text-[#3b9eff] hover:underline">
                                {step.link}
                              </a>
                            )}
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                            step.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            step.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-white/10 text-white/50'
                          }`}>
                            {step.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Lawyer Card */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Still Confused?</h4>
                        <p className="text-xs text-white/50">Get human help from verified advisors</p>
                      </div>
                      <button
                        onClick={handleContactLawyer}
                        className="px-4 py-2 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-all"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* NestQuest Tool */}
        {activeTab === 'nestquest' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* NestQuest Card */}
            <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-green-500/30 to-emerald-500/10">
              <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.4)]">
                      <span className="text-3xl">🏠</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                        NestQuest
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">
                          Free Tool
                        </span>
                      </h2>
                      <p className="text-xs text-white/60">Chrome Extension for Otodom</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    One click on any Otodom listing and get instant English analysis with <span className="font-semibold text-green-400">true cost breakdown</span>, <span className="font-semibold text-amber-400">scam detection</span>, and <span className="font-semibold text-blue-400">commute times</span>.
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-green-400 mb-1">True Cost</p>
                      <p className="text-[10px] text-white/60">Real monthly expenses</p>
                    </div>
                    <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-amber-400 mb-1">Scam Detection</p>
                      <p className="text-[10px] text-white/60">AI-powered alerts</p>
                    </div>
                    <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-blue-400 mb-1">Commute Times</p>
                      <p className="text-[10px] text-white/60">To your workplace</p>
                    </div>
                    <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-purple-400 mb-1">Salary Stress Test</p>
                      <p className="text-[10px] text-white/60">Can you afford it?</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="p-4 rounded-[16px] bg-green-500/10 border border-green-400/20 mb-4">
                    <h3 className="text-sm font-bold text-green-400 mb-2">✓ Perfect for Expats</h3>
                    <ul className="space-y-1.5">
                      <li className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>Instant English translations of Polish listings</span>
                      </li>
                      <li className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>Detects overpriced listings and hidden fees</span>
                      </li>
                      <li className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>Shows real commute times to Warsaw center</span>
                      </li>
                      <li className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>100% free, no subscription required</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="https://chromewebstore.google.com/detail/nestquest/lmbkkgedjmcoackmbdkmdgmgenhlaako?pli=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3.5 rounded-[16px] bg-gradient-to-b from-[#10b981] to-[#059669] font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                      <span className="text-base">Add to Chrome - it's free</span>
                      <span className="text-lg">→</span>
                    </button>
                  </a>

                  {/* Footer Note */}
                  <p className="text-[10px] text-white/40 text-center mt-3">
                    Works on Otodom.pl • Developed for Warsaw expats
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                <h3 className="font-bold mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-400">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">Install Extension</p>
                      <p className="text-xs text-white/60">One-click install from Chrome Web Store</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-400">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">Browse Otodom</p>
                      <p className="text-xs text-white/60">Go to any apartment listing on Otodom.pl</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-400">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">Get Instant Analysis</p>
                      <p className="text-xs text-white/60">Extension automatically analyzes costs, scams, and commute</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                <h3 className="font-bold mb-4">Trusted by Warsaw Expats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400 mb-1">500+</p>
                    <p className="text-[10px] text-white/50 uppercase">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400 mb-1">50+</p>
                    <p className="text-[10px] text-white/50 uppercase">Scams Avoided</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400 mb-1">4.8★</p>
                    <p className="text-[10px] text-white/50 uppercase">User Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showLawyerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center"
            onClick={() => setShowLawyerModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-t-[28px] p-[1px] bg-gradient-to-b from-white/30 to-white/10"
            >
              <div className="rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                    Request Lawyer Review
                  </h3>
                  <button onClick={() => setShowLawyerModal(false)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10">
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                <p className="text-sm text-white/65 mb-4">
                  A verified lawyer will review high-risk and unclear clauses with Polish law context.
                </p>

                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email for follow-up"
                    value={lawyerForm.email}
                    onChange={(e) => setLawyerForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#3b9eff]/50"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLawyerForm((prev) => ({ ...prev, priority: 'standard' }))}
                      className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        lawyerForm.priority === 'standard'
                          ? 'bg-[#3b9eff]/20 border-[#3b9eff]/30 text-[#3b9eff]'
                          : 'bg-white/5 border-white/10 text-white/65'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5" strokeWidth={2} />
                        Standard (24h)
                      </span>
                    </button>
                    <button
                      onClick={() => setLawyerForm((prev) => ({ ...prev, priority: 'urgent' }))}
                      className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        lawyerForm.priority === 'urgent'
                          ? 'bg-red-500/20 border-red-400/30 text-red-400'
                          : 'bg-white/5 border-white/10 text-white/65'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                        Urgent (6h)
                      </span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Optional note: specific clause you want reviewed first."
                    value={lawyerForm.note}
                    onChange={(e) => setLawyerForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#3b9eff]/50 resize-none"
                  />
                </div>

                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                  <p className="text-xs text-amber-300">
                    AI screening is preliminary. Final legal interpretation comes from a human lawyer review.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSubmitLawyerRequest}
                    disabled={requestingLawyer}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)] disabled:opacity-70"
                  >
                    {requestingLawyer ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    onClick={() => setShowLawyerModal(false)}
                    className="px-5 py-3 rounded-lg bg-white/10 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

