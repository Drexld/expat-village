import { hasApiBaseUrl } from '../api/http';
import {
  generateOnboardingContentRequest,
  generateOnboardingFinalBanterRequest,
} from '../api/repositories/onboardingRepository';
import type {
  OnboardingContent as ApiOnboardingContent,
  OnboardingContentInput,
  OnboardingFinalBanterInput,
  OnboardingQuizQuestion,
} from '../api/types';

export type QuizQuestion = OnboardingQuizQuestion;
export type OnboardingContent = ApiOnboardingContent;

function normalizeQuiz(input: unknown): QuizQuestion[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      const question =
        typeof item === 'object' &&
        item !== null &&
        'question' in item &&
        typeof item.question === 'string'
          ? item.question.trim()
          : '';
      const options =
        typeof item === 'object' && item !== null && 'options' in item && Array.isArray(item.options)
          ? item.options
              .filter((option: unknown) => typeof option === 'string')
              .map((option: string) => option.trim())
          : [];
      const correctIndex =
        typeof item === 'object' &&
        item !== null &&
        'correctIndex' in item &&
        Number.isInteger(item.correctIndex)
          ? Number(item.correctIndex)
          : 0;

      if (!question || options.length !== 4 || correctIndex < 0 || correctIndex > 3) {
        return null;
      }

      return {
        question,
        options,
        correctIndex,
      } satisfies QuizQuestion;
    })
    .filter((entry): entry is QuizQuestion => entry !== null)
    .slice(0, 5);
}

export async function generateOnboardingContent(
  params: OnboardingContentInput,
): Promise<OnboardingContent> {
  const payload: OnboardingContentInput = {
    userName: params.userName.trim(),
    tribe: params.tribe.trim(),
    interest: params.interest.trim(),
  };
  if (!hasApiBaseUrl()) {
    throw new Error('Live onboarding API is not configured.');
  }

  const generated = await generateOnboardingContentRequest(payload);
  const quiz = normalizeQuiz(generated.quiz);
  if (quiz.length < 5) {
    throw new Error('Onboarding quiz generation returned incomplete data.');
  }

  return {
    initialBanter: generated.initialBanter?.trim() || 'Your onboarding challenge is ready.',
    badgeName: generated.badgeName?.trim() || `${payload.tribe} Vanguard`,
    quiz,
  };
}

export async function generateFinalBanter(
  params: OnboardingFinalBanterInput,
): Promise<string> {
  const payload: OnboardingFinalBanterInput = {
    userName: params.userName.trim(),
    tribe: params.tribe.trim(),
    interest: params.interest.trim(),
    score: params.score,
    total: params.total,
  };
  if (!hasApiBaseUrl()) {
    throw new Error('Live onboarding API is not configured.');
  }

  const response = await generateOnboardingFinalBanterRequest(payload);
  const banter = response.banter?.trim();
  if (!banter) {
    throw new Error('Final onboarding banter was empty.');
  }
  return banter;
}
