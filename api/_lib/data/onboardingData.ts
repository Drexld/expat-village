import type {
  OnboardingContent,
  OnboardingContentInput,
  OnboardingFinalBanterInput,
  OnboardingFinalBanterResult,
  OnboardingQuizQuestion,
} from '../../../src/services/api/types';
import { internalError } from '../security';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function envValue(name: string): string {
  const maybeProcess = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  return maybeProcess.process?.env?.[name]?.trim() || '';
}

function getGroqApiKey(): string {
  return envValue('GROQ_API_KEY');
}

function extractJsonObject(text: string): string | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }
  return null;
}

function normalizeQuiz(input: unknown): OnboardingQuizQuestion[] {
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
              .filter((opt: unknown) => typeof opt === 'string')
              .map((opt: string) => opt.trim())
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

      return { question, options, correctIndex } satisfies OnboardingQuizQuestion;
    })
    .filter((entry): entry is OnboardingQuizQuestion => entry !== null)
    .slice(0, 5);
}

async function requestGroqChat(
  prompt: string,
  options?: { temperature?: number; maxTokens?: number; system?: string },
): Promise<string | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: options?.temperature ?? 0.9,
        max_tokens: options?.maxTokens ?? 1800,
        messages: [
          { role: 'system', content: options?.system || 'You are a precise assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return String(data?.choices?.[0]?.message?.content || '').trim() || null;
  } catch {
    return null;
  }
}

export async function generateOnboardingContentData(
  input: OnboardingContentInput,
): Promise<OnboardingContent> {
  if (!getGroqApiKey()) {
    throw internalError('Onboarding AI provider is not configured.');
  }

  const prompt = `
You are creating an onboarding mini-game for a mobile expat community app.
Name: ${input.userName}
Tribe: ${input.tribe}
Interest: ${input.interest}

Return STRICT JSON only with this shape:
{
  "initialBanter": "short witty banter, playful, family-friendly",
  "badgeName": "2-4 word badge",
  "quiz": [
    { "question": "...", "options": ["A","B","C","D"], "correctIndex": 0 }
  ]
}

Rules:
- Generate exactly 5 quiz questions.
- Questions should relate to the given interest and social community vibe.
- correctIndex must be an integer in [0,3].
- No markdown, no commentary.
`.trim();

  const raw = await requestGroqChat(prompt, {
    temperature: 0.9,
    maxTokens: 2000,
    system: 'You generate JSON only.',
  });

  if (!raw) {
    throw internalError('Onboarding AI generation failed.');
  }

  const jsonText = extractJsonObject(raw);
  if (!jsonText) {
    throw internalError('Onboarding AI returned invalid JSON.');
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<OnboardingContent>;
    const quiz = normalizeQuiz(parsed.quiz);
    if (quiz.length < 5) {
      throw internalError('Onboarding AI returned an incomplete quiz.');
    }

    const initialBanter =
      typeof parsed.initialBanter === 'string' && parsed.initialBanter.trim()
        ? parsed.initialBanter.trim()
        : `Welcome ${input.userName}, your ${input.tribe} challenge is ready.`;
    const badgeName =
      typeof parsed.badgeName === 'string' && parsed.badgeName.trim()
        ? parsed.badgeName.trim()
        : `${input.tribe} Vanguard`;

    return {
      initialBanter,
      badgeName,
      quiz: quiz.slice(0, 5),
    };
  } catch {
    throw internalError('Onboarding AI response parsing failed.');
  }
}

export async function generateOnboardingFinalBanterData(
  input: OnboardingFinalBanterInput,
): Promise<OnboardingFinalBanterResult> {
  if (!getGroqApiKey()) {
    throw internalError('Onboarding AI provider is not configured.');
  }

  const prompt = `
Write one short playful result message for onboarding quiz completion.
Name: ${input.userName}
Tribe: ${input.tribe}
Interest: ${input.interest}
Score: ${input.score}/${input.total}
Tone: witty, supportive, mildly teasing, family-friendly.
Return plain text only.
`.trim();

  const raw = await requestGroqChat(prompt, {
    temperature: 1.0,
    maxTokens: 180,
    system: 'Return plain text only.',
  });

  if (!raw) {
    throw internalError('Final onboarding banter generation failed.');
  }
  const banter = raw.replace(/\s+/g, ' ').trim().slice(0, 320);
  if (!banter) {
    throw internalError('Final onboarding banter was empty.');
  }
  return { banter };
}
