import type {
  ContractAnalysisInput,
  ContractAnalysisResult,
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  LawyerReviewRequestInput,
  LawyerReviewRequestResult,
} from '../../../src/services/api/types';
import { badRequest } from '../security';
import { supabaseInsert, supabaseSelect } from './supabaseRest';

type RiskLevel = 'low' | 'medium' | 'high';
type Urgency = 'low' | 'medium' | 'high';

const MODEL_VERSION = 'expat-village-ai-pl-v1';

function normalizeInput(input: ContractAnalysisInput | DocumentAnalysisInput): string {
  return `${input.documentName || ''}\n${input.documentText || ''}`.toLowerCase();
}

function includesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface ContractSignal {
  scoreDelta: number;
  message: string;
  patterns: RegExp[];
}

const CONTRACT_SIGNALS: ContractSignal[] = [
  {
    scoreDelta: 22,
    message: 'Deposit protection and return conditions are unclear or missing.',
    patterns: [/deposit.*(not return|non[- ]?refundable)/, /kaucj[aey].*(bezzwrot|niezwrot)/],
  },
  {
    scoreDelta: 18,
    message: 'Termination clause appears imbalanced or unusually strict.',
    patterns: [/termination.*without notice/, /natychmiastowe wypowiedzenie/, /penalt(y|ies).*(terminate|exit)/],
  },
  {
    scoreDelta: 20,
    message: 'Entry/privacy clause may allow landlord access without proper notice.',
    patterns: [/landlord.*enter.*any time/, /wstep.*bez uprzedzenia/, /access.*without notice/],
  },
  {
    scoreDelta: 16,
    message: 'Utility and service cost responsibilities are not clearly defined.',
    patterns: [/utilities.*not included/, /tenant pays all repairs/, /media.*bez rozliczenia/],
  },
  {
    scoreDelta: 14,
    message: 'No clear dispute resolution or governing-law wording detected.',
    patterns: [/governing law missing/, /no jurisdiction/, /brak prawa wlasciwego/],
  },
];

function contractRiskAnalysis(input: ContractAnalysisInput): {
  riskScore: number;
  riskLevel: RiskLevel;
  redFlags: string[];
  summary: string;
} {
  const text = normalizeInput(input);
  const redFlags: string[] = [];
  let score = 20;

  CONTRACT_SIGNALS.forEach((signal) => {
    if (includesAny(text, signal.patterns)) {
      score += signal.scoreDelta;
      redFlags.push(signal.message);
    }
  });

  if (!includesAny(text, [/kaucj/, /deposit/])) {
    score += 8;
    redFlags.push('Deposit amount, holding terms, and return timeline are not explicit.');
  }

  if (!includesAny(text, [/notice period/, /okres wypowiedzenia/, /wypowiedzen/])) {
    score += 7;
    redFlags.push('Notice period and termination mechanics require explicit clarification.');
  }

  if (!includesAny(text, [/media/, /utilities/, /czynsz/, /oplat/])) {
    score += 6;
    redFlags.push('Utility settlement formula is missing and may create billing disputes.');
  }

  const riskScore = clamp(score, 0, 100);
  const riskLevel: RiskLevel = riskScore >= 71 ? 'high' : riskScore >= 41 ? 'medium' : 'low';

  const uniqueFlags = dedupe(redFlags);
  const summary =
    uniqueFlags.length > 0
      ? `Analyzed under Polish rental-law context (PL). ${uniqueFlags.length} potentially risky clauses detected and should be reviewed by a qualified lawyer before signing.`
      : 'Analyzed under Polish rental-law context (PL). No high-risk clauses were detected in this pass, but legal review is still recommended.';

  return {
    riskScore,
    riskLevel,
    redFlags: uniqueFlags,
    summary,
  };
}

function detectDocumentType(text: string): string {
  if (includesAny(text, [/invoice/, /faktura/, /rachunek/])) return 'Invoice';
  if (includesAny(text, [/tax/, /pit[- ]?\d+/, /urzad skarbowy/])) return 'Tax Notice';
  if (includesAny(text, [/contract/, /umowa/])) return 'Contract';
  if (includesAny(text, [/deadline/, /within \d+ days/, /wezwanie/, /decyzja/])) return 'Official Notice';
  if (includesAny(text, [/application/, /wniosek/, /formularz/])) return 'Application Form';
  return 'General Official Document';
}

function detectUrgency(text: string): Urgency {
  if (
    includesAny(text, [
      /urgent/,
      /immediate/,
      /within\s+[1-7]\s+days/,
      /final notice/,
      /ostateczne wezwanie/,
      /natychmiast/,
    ])
  ) {
    return 'high';
  }
  if (
    includesAny(text, [/within \d+ days/, /deadline/, /termin/, /required action/, /wymagane dzialanie/])
  ) {
    return 'medium';
  }
  return 'low';
}

function extractKeyPoints(input: DocumentAnalysisInput): string[] {
  const raw = input.documentText || '';
  const sentences = raw
    .replace(/\s+/g, ' ')
    .split(/[.!?]/)
    .map((line) => line.trim())
    .filter(Boolean);

  const priorityLines = sentences.filter((line) =>
    includesAny(line.toLowerCase(), [
      /deadline/,
      /within/,
      /required/,
      /must/,
      /fee/,
      /payment/,
      /appointment/,
      /tax/,
      /termin/,
      /oplata/,
      /wymagane/,
    ]),
  );

  const selected = (priorityLines.length ? priorityLines : sentences).slice(0, 4);
  if (!selected.length) {
    return [
      'Document scanned and translated context prepared.',
      'Review deadlines and mandatory actions before submission.',
      'Keep a copy of all confirmations and reference numbers.',
    ];
  }

  return dedupe(selected.map((line) => line.replace(/\s+/g, ' ').trim()));
}

function buildNextSteps(
  type: string,
  urgency: Urgency,
): Array<{ title: string; priority: 'low' | 'medium' | 'high' }> {
  const steps: Array<{ title: string; priority: 'low' | 'medium' | 'high' }> = [];

  if (urgency === 'high') {
    steps.push({ title: 'Act within the stated deadline and keep proof of submission.', priority: 'high' });
  }

  if (type === 'Tax Notice') {
    steps.push({ title: 'Check your e-PIT account and validate tax data.', priority: 'high' });
    steps.push({ title: 'Gather income and deduction documents before filing.', priority: 'medium' });
  } else if (type === 'Official Notice') {
    steps.push({ title: 'Confirm which office issued the notice and reference number.', priority: 'high' });
    steps.push({ title: 'Book an appointment if in-person follow-up is required.', priority: 'medium' });
  } else if (type === 'Application Form') {
    steps.push({ title: 'Verify all required attachments before submission.', priority: 'medium' });
    steps.push({ title: 'Prepare translated copies for non-Polish documents.', priority: 'medium' });
  } else {
    steps.push({ title: 'Review obligations and required actions listed in the document.', priority: 'medium' });
    steps.push({ title: 'Consult a professional if legal meaning is unclear.', priority: 'low' });
  }

  if (!steps.length) {
    steps.push({ title: 'Review and archive this document.', priority: 'low' });
  }

  return steps.slice(0, 4);
}

interface InsertedContractAnalysis {
  id: string;
}

export async function analyzeContractData(
  userId: string,
  input: ContractAnalysisInput,
): Promise<ContractAnalysisResult> {
  const analysis = contractRiskAnalysis(input);

  const rows = await supabaseInsert<
    {
      user_id: string;
      document_name: string;
      document_path?: string;
      risk_score: number;
      risk_level: RiskLevel;
      ai_summary: string;
      legal_framework: 'PL';
      model_version: string;
    },
    InsertedContractAnalysis
  >(
    'contract_analyses',
    {
      user_id: userId,
      document_name: input.documentName,
      document_path: input.documentUrl,
      risk_score: analysis.riskScore,
      risk_level: analysis.riskLevel,
      ai_summary: `${analysis.summary}\nFlags: ${analysis.redFlags.join(' | ') || 'none'}`,
      legal_framework: 'PL',
      model_version: MODEL_VERSION,
    },
    { returning: 'representation' },
  );

  return {
    id: rows[0]?.id || `contract-analysis-${Date.now()}`,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    summary: analysis.summary,
    redFlags: analysis.redFlags,
    legalFramework: 'PL',
  };
}

interface InsertedDocumentAnalysis {
  id: string;
}

export async function analyzeDocumentData(
  userId: string,
  input: DocumentAnalysisInput,
): Promise<DocumentAnalysisResult> {
  const text = normalizeInput(input);
  const documentType = detectDocumentType(text);
  const urgency = detectUrgency(text);
  const keyPoints = extractKeyPoints(input);
  const nextSteps = buildNextSteps(documentType, urgency);
  const summary = keyPoints[0] || 'Document analyzed.';

  const rows = await supabaseInsert<
    {
      user_id: string;
      document_name: string;
      document_type: string;
      urgency: Urgency;
      summary: string;
      next_steps: Array<{ title: string; priority: 'low' | 'medium' | 'high' }>;
      model_version: string;
    },
    InsertedDocumentAnalysis
  >(
    'document_analyses',
    {
      user_id: userId,
      document_name: input.documentName,
      document_type: documentType,
      urgency,
      summary,
      next_steps: nextSteps,
      model_version: MODEL_VERSION,
    },
    { returning: 'representation' },
  );

  return {
    id: rows[0]?.id || `document-analysis-${Date.now()}`,
    documentType,
    urgency,
    keyPoints,
    nextSteps,
  };
}

interface ContractAnalysisOwnershipRow {
  id: string;
}

interface InsertedLawyerReviewRequest {
  id: string;
  status: 'requested' | 'triaged' | 'assigned' | 'completed';
  created_at: string;
}

export async function requestLawyerReviewData(
  userId: string,
  input: LawyerReviewRequestInput,
): Promise<LawyerReviewRequestResult> {
  if (input.contractAnalysisId) {
    const owned = await supabaseSelect<ContractAnalysisOwnershipRow>('contract_analyses', 'id', {
      limit: 1,
      filters: [
        { column: 'id', op: 'eq', value: input.contractAnalysisId },
        { column: 'user_id', op: 'eq', value: userId },
      ],
    });

    if (!owned.length) {
      throw badRequest('Invalid contractAnalysisId for this user');
    }
  }

  const rows = await supabaseInsert<
    {
      user_id: string;
      contract_analysis_id?: string;
      status: 'requested';
      contact_email?: string;
      contact_phone?: string;
      notes?: string;
    },
    InsertedLawyerReviewRequest
  >(
    'lawyer_review_requests',
    {
      user_id: userId,
      contract_analysis_id: input.contractAnalysisId,
      status: 'requested',
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      notes: input.notes,
    },
    { returning: 'representation' },
  );

  const row = rows[0];
  return {
    id: row?.id || `lawyer-request-${Date.now()}`,
    status: row?.status || 'requested',
    createdAt: row?.created_at || new Date().toISOString(),
  };
}
