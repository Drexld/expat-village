export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface OnboardingContent {
  initialBanter: string;
  quiz: QuizQuestion[];
  badgeName: string;
}

function extractJsonObject(text: string): string | null {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }

  return null;
}

function normalizeQuiz(input: unknown): QuizQuestion[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      const question = typeof item?.question === 'string' ? item.question.trim() : '';
      const options = Array.isArray(item?.options)
        ? item.options.filter((opt: unknown) => typeof opt === 'string').map((opt: string) => opt.trim())
        : [];
      const correctIndex = Number.isInteger(item?.correctIndex) ? item.correctIndex : 0;

      if (!question || options.length !== 4 || correctIndex < 0 || correctIndex > 3) return null;

      return { question, options, correctIndex };
    })
    .filter((q): q is QuizQuestion => q !== null)
    .slice(0, 5);
}

function getFallbackContent(tribe: string, interest: string): OnboardingContent {
  const interestLabel = interest || tribe;
  return {
    initialBanter: `Bold pick with ${interestLabel}. Warsaw respects confidence, but let's see if you can back it up.`,
    badgeName: `${tribe} Vanguard`,
    quiz: [
      {
        question: `Which statement best represents ${interestLabel}?`,
        options: [
          'It has no fan culture',
          'It has iconic moments and loyal fans',
          'It is only relevant in one city',
          'Nobody discusses it online',
        ],
        correctIndex: 1,
      },
      {
        question: 'What makes a great community conversation starter?',
        options: [
          'Only one-word replies',
          'Respectful opinions with specific examples',
          'Avoid all context',
          'Never ask questions',
        ],
        correctIndex: 1,
      },
      {
        question: 'How do you build tribe identity in a community app?',
        options: [
          'No personalization',
          'Ignore user interests',
          'Use badges and shared themes',
          'Hide all user preferences',
        ],
        correctIndex: 2,
      },
      {
        question: 'Best way to keep a quiz engaging?',
        options: [
          'Very repetitive prompts',
          'Personalized questions and instant feedback',
          'No score display',
          'No transitions',
        ],
        correctIndex: 1,
      },
      {
        question: 'What helps onboarding retention most?',
        options: [
          'Clear identity and fun first experience',
          'Long legal text first',
          'Skip all interaction',
          'Hide all progress',
        ],
        correctIndex: 0,
      },
    ],
  };
}

export async function generateOnboardingContent(params: {
  userName: string;
  tribe: string;
  interest: string;
}): Promise<OnboardingContent> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) {
    return getFallbackContent(params.tribe, params.interest);
  }

  const prompt = `
You are creating an onboarding mini-game for a mobile app community.
User name: ${params.userName}
Tribe: ${params.tribe}
Interest: ${params.interest}

Return STRICT JSON only using this shape:
{
  "initialBanter": "short witty banter, playful, not offensive",
  "badgeName": "2-4 word badge",
  "quiz": [
    { "question": "...", "options": ["A","B","C","D"], "correctIndex": 0 }
  ]
}

Rules:
- Create exactly 5 quiz questions.
- Questions must relate to ${params.interest} and broader community vibe.
- Keep content family-friendly and concise.
- correctIndex must be 0..3.
`.trim();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: 'You generate JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return getFallbackContent(params.tribe, params.interest);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    const jsonText = extractJsonObject(raw);
    if (!jsonText) {
      return getFallbackContent(params.tribe, params.interest);
    }

    const parsed = JSON.parse(jsonText);
    const quiz = normalizeQuiz(parsed?.quiz);
    if (quiz.length < 5) {
      return getFallbackContent(params.tribe, params.interest);
    }

    const initialBanter =
      typeof parsed?.initialBanter === 'string' && parsed.initialBanter.trim()
        ? parsed.initialBanter.trim()
        : getFallbackContent(params.tribe, params.interest).initialBanter;
    const badgeName =
      typeof parsed?.badgeName === 'string' && parsed.badgeName.trim()
        ? parsed.badgeName.trim()
        : `${params.tribe} Vanguard`;

    return { initialBanter, badgeName, quiz };
  } catch {
    return getFallbackContent(params.tribe, params.interest);
  }
}

export async function generateFinalBanter(params: {
  userName: string;
  tribe: string;
  interest: string;
  score: number;
  total: number;
}): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  const performance =
    params.score === params.total
      ? 'perfect'
      : params.score >= Math.ceil(params.total * 0.6)
      ? 'good'
      : 'needs-work';

  const fallback =
    performance === 'perfect'
      ? `Unreal ${params.userName}. ${params.interest} tribe captain energy.`
      : performance === 'good'
      ? `Solid run, ${params.userName}. You're officially in the ${params.tribe} circle.`
      : `Brave effort, ${params.userName}. We still claim you, but training starts now.`;

  if (!apiKey) return fallback;

  const prompt = `
Write one short playful result banter message.
Name: ${params.userName}
Tribe: ${params.tribe}
Interest: ${params.interest}
Score: ${params.score}/${params.total}
Tone: witty, supportive, mildly teasing, family-friendly.
Return plain text only.
`.trim();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 1.0,
        max_tokens: 200,
        messages: [
          { role: 'system', content: 'You return plain text only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const text = String(data?.choices?.[0]?.message?.content ?? '').trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

