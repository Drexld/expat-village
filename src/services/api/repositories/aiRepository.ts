import { apiPost } from '../http';
import type {
  ContractAnalysisInput,
  ContractAnalysisResult,
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  LawyerReviewRequestInput,
  LawyerReviewRequestResult,
} from '../types';

export async function analyzeContract(input: ContractAnalysisInput): Promise<ContractAnalysisResult> {
  return apiPost<ContractAnalysisResult>('/api/ai/contract/analyze', input);
}

export async function analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisResult> {
  return apiPost<DocumentAnalysisResult>('/api/ai/document/analyze', input);
}

export async function requestLawyerReview(input: LawyerReviewRequestInput): Promise<LawyerReviewRequestResult> {
  return apiPost<LawyerReviewRequestResult>('/api/ai/contract/lawyer-request', input);
}
