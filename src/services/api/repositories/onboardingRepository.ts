import { apiPost } from '../http';
import type {
  OnboardingContent,
  OnboardingContentInput,
  OnboardingFinalBanterInput,
  OnboardingFinalBanterResult,
} from '../types';

export async function generateOnboardingContentRequest(
  input: OnboardingContentInput,
): Promise<OnboardingContent> {
  return apiPost<OnboardingContent>('/api/ai/onboarding/content', input);
}

export async function generateOnboardingFinalBanterRequest(
  input: OnboardingFinalBanterInput,
): Promise<OnboardingFinalBanterResult> {
  return apiPost<OnboardingFinalBanterResult>('/api/ai/onboarding/final-banter', input);
}
