import { useMemo } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  analyzeContract as analyzeContractRequest,
  analyzeDocument as analyzeDocumentRequest,
  requestLawyerReview as requestLawyerReviewRequest,
} from '../repositories/aiRepository';
import type {
  ContractAnalysisInput,
  ContractAnalysisResult,
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  LawyerReviewRequestInput,
  LawyerReviewRequestResult,
} from '../types';

interface UseAIToolsOptions {
  enabled?: boolean;
}

interface UseAIToolsResult {
  isLive: boolean;
  analyzeContract: (input: ContractAnalysisInput) => Promise<ContractAnalysisResult>;
  analyzeDocument: (input: DocumentAnalysisInput) => Promise<DocumentAnalysisResult>;
  requestLawyerReview: (input: LawyerReviewRequestInput) => Promise<LawyerReviewRequestResult>;
}

function createMockContractAnalysis(): ContractAnalysisResult {
  return {
    id: `local-contract-${Date.now()}`,
    riskScore: 25,
    riskLevel: 'medium',
    summary: 'Contract has acceptable structure but includes clauses that need legal clarification.',
    redFlags: [
      'No explicit landlord tax-registration clause',
      'Deposit return timeline is not clearly defined',
      'Utilities settlement method needs invoice-level detail',
    ],
    legalFramework: 'PL',
  };
}

function createMockDocumentAnalysis(): DocumentAnalysisResult {
  return {
    id: `local-document-${Date.now()}`,
    documentType: 'Tax Office Notice',
    urgency: 'medium',
    keyPoints: [
      'Annual tax return (PIT) filing is expected.',
      'Check your e-PIT account for prefilled data.',
      'Validate submission before the filing deadline.',
    ],
    nextSteps: [
      { title: 'Check e-PIT account', priority: 'high' },
      { title: 'Gather supporting income documents', priority: 'medium' },
      { title: 'Consult tax advisor if unclear', priority: 'low' },
    ],
  };
}

function createMockLawyerRequest(): LawyerReviewRequestResult {
  return {
    id: `local-lawyer-${Date.now()}`,
    status: 'requested',
    createdAt: new Date().toISOString(),
  };
}

export function useAITools(options: UseAIToolsOptions = {}): UseAIToolsResult {
  const { enabled = true } = options;
  const shouldFetch = enabled && hasApiBaseUrl();

  return useMemo(
    () => ({
      isLive: shouldFetch,
      analyzeContract: async (input: ContractAnalysisInput) => {
        if (!shouldFetch) return createMockContractAnalysis();
        return analyzeContractRequest(input);
      },
      analyzeDocument: async (input: DocumentAnalysisInput) => {
        if (!shouldFetch) return createMockDocumentAnalysis();
        return analyzeDocumentRequest(input);
      },
      requestLawyerReview: async (input: LawyerReviewRequestInput) => {
        if (!shouldFetch) return createMockLawyerRequest();
        return requestLawyerReviewRequest(input);
      },
    }),
    [shouldFetch],
  );
}
