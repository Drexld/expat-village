import { apiGet, apiPost } from '../http';
import type {
  AIHubAdvisorInput,
  AIHubBundle,
  AIHubDecisionAdvice,
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

export async function getAIHubBundle(): Promise<AIHubBundle> {
  return apiGet<AIHubBundle>('/api/ai/hub');
}

export async function analyzeAIHubScenario(input: AIHubAdvisorInput): Promise<AIHubDecisionAdvice> {
  return apiPost<AIHubDecisionAdvice>('/api/ai/hub/advisor', input);
}
