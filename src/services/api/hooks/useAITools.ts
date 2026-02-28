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

export function useAITools(options: UseAIToolsOptions = {}): UseAIToolsResult {
  const { enabled = true } = options;
  const shouldFetch = enabled && hasApiBaseUrl();

  return useMemo(
    () => ({
      isLive: shouldFetch,
      analyzeContract: async (input: ContractAnalysisInput) => {
        if (!shouldFetch) throw new Error('AI API is not configured.');
        return analyzeContractRequest(input);
      },
      analyzeDocument: async (input: DocumentAnalysisInput) => {
        if (!shouldFetch) throw new Error('AI API is not configured.');
        return analyzeDocumentRequest(input);
      },
      requestLawyerReview: async (input: LawyerReviewRequestInput) => {
        if (!shouldFetch) throw new Error('AI API is not configured.');
        return requestLawyerReviewRequest(input);
      },
    }),
    [shouldFetch],
  );
}
