import type { ValidationResult, Validator } from '../security';
import {
  asObject,
  oneOf,
  optionalBoolean,
  optionalString,
  optionalStringArray,
  requiredNumber,
  requiredString,
} from '../security';

function pass<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

function reject<T>(errors: string[]): ValidationResult<T> {
  return { ok: false, errors };
}

function errorsFrom<T>(result: ValidationResult<T>): string[] {
  return result.ok ? [] : ((result as { errors?: string[] }).errors || []);
}

function valueFrom<T>(result: ValidationResult<T>): T {
  return (result as { value: T }).value;
}

function objectInput<T>(
  input: unknown,
  next: (payload: Record<string, unknown>) => ValidationResult<T>,
): ValidationResult<T> {
  const obj = asObject(input);
  if (!obj.ok) return reject<T>(((obj as { errors?: string[] }).errors || []));
  return next(obj.value);
}

export interface CommunityCreatePostInput {
  title: string;
  body: string;
  topicId?: string;
  hasVoice?: boolean;
}

export const validateCommunityCreatePost: Validator<CommunityCreatePostInput> = (input) =>
  objectInput(input, (payload) => {
    const title = requiredString(payload.title, 'title', 3, 160);
    const body = requiredString(payload.body, 'body', 5, 8000);
    const topicId = optionalString(payload.topicId, 'topicId', 80);
    const hasVoice = optionalBoolean(payload.hasVoice, 'hasVoice');

    const errors = [
      ...errorsFrom(title),
      ...errorsFrom(body),
      ...errorsFrom(topicId),
      ...errorsFrom(hasVoice),
    ];
    if (errors.length) return reject(errors);

    return pass({
      title: valueFrom(title),
      body: valueFrom(body),
      topicId: valueFrom(topicId),
      hasVoice: valueFrom(hasVoice),
    });
  });

export interface CommunityCommentInput {
  body: string;
}

export const validateCommunityComment: Validator<CommunityCommentInput> = (input) =>
  objectInput(input, (payload) => {
    const body = requiredString(payload.body, 'body', 1, 4000);
    const errors = errorsFrom(body);
    if (errors.length) return reject(errors);
    return pass({ body: valueFrom(body) });
  });

export interface CommunityReactionInput {
  reaction: string;
}

const allowedReactions = ['like', 'helpful', 'agree', 'insightful'] as const;

export const validateCommunityReaction: Validator<CommunityReactionInput> = (input) =>
  objectInput(input, (payload) => {
    const reaction = oneOf(payload.reaction, 'reaction', allowedReactions);
    const errors = errorsFrom(reaction);
    if (errors.length) return reject(errors);
    return pass({ reaction: valueFrom(reaction) });
  });

export interface MarketplaceCreateListingInput {
  title: string;
  price: number;
  category: string;
  description: string;
  escrowRequested?: boolean;
}

export const validateMarketplaceCreateListing: Validator<MarketplaceCreateListingInput> = (
  input,
) =>
  objectInput(input, (payload) => {
    const title = requiredString(payload.title, 'title', 3, 200);
    const price = requiredNumber(payload.price, 'price', { min: 1, max: 1_000_000 });
    const category = requiredString(payload.category, 'category', 2, 80);
    const description = requiredString(payload.description, 'description', 10, 6000);
    const escrowRequested = optionalBoolean(payload.escrowRequested, 'escrowRequested');

    const errors = [
      ...errorsFrom(title),
      ...errorsFrom(price),
      ...errorsFrom(category),
      ...errorsFrom(description),
      ...errorsFrom(escrowRequested),
    ];
    if (errors.length) return reject(errors);

    return pass({
      title: valueFrom(title),
      price: valueFrom(price),
      category: valueFrom(category),
      description: valueFrom(description),
      escrowRequested: valueFrom(escrowRequested),
    });
  });

export interface MarketplaceInterestInput {
  mode: 'secure_buy' | 'message_seller';
}

export const validateMarketplaceInterest: Validator<MarketplaceInterestInput> = (input) =>
  objectInput(input, (payload) => {
    const mode = oneOf(payload.mode, 'mode', ['secure_buy', 'message_seller']);
    const errors = errorsFrom(mode);
    if (errors.length) return reject(errors);
    return pass({ mode: valueFrom(mode) });
  });

export interface MarketplaceReviewInput {
  rating: number;
  body: string;
}

export const validateMarketplaceReview: Validator<MarketplaceReviewInput> = (input) =>
  objectInput(input, (payload) => {
    const rating = requiredNumber(payload.rating, 'rating', { min: 1, max: 5, integer: true });
    const body = requiredString(payload.body, 'body', 4, 3000);
    const errors = [...errorsFrom(rating), ...errorsFrom(body)];
    if (errors.length) return reject(errors);
    return pass({ rating: valueFrom(rating), body: valueFrom(body) });
  });

export interface ServiceReviewInput {
  rating: number;
  title?: string;
  body: string;
  tags?: string[];
}

export const validateServiceReview: Validator<ServiceReviewInput> = (input) =>
  objectInput(input, (payload) => {
    const rating = requiredNumber(payload.rating, 'rating', { min: 1, max: 5, integer: true });
    const title = optionalString(payload.title, 'title', 140);
    const body = requiredString(payload.body, 'body', 4, 3000);
    const tags = optionalStringArray(payload.tags, 'tags', {
      maxItems: 10,
      itemMaxLength: 30,
    });
    const errors = [
      ...errorsFrom(rating),
      ...errorsFrom(title),
      ...errorsFrom(body),
      ...errorsFrom(tags),
    ];
    if (errors.length) return reject(errors);

    return pass({
      rating: valueFrom(rating),
      title: valueFrom(title),
      body: valueFrom(body),
      tags: valueFrom(tags),
    });
  });

export interface TaskStatusUpdateInput {
  status: 'todo' | 'in_progress' | 'done';
}

export const validateTaskStatusUpdate: Validator<TaskStatusUpdateInput> = (input) =>
  objectInput(input, (payload) => {
    const status = oneOf(payload.status, 'status', ['todo', 'in_progress', 'done']);
    const errors = errorsFrom(status);
    if (errors.length) return reject(errors);
    return pass({ status: valueFrom(status) });
  });

export interface PollVoteInput {
  optionId: string;
}

export const validatePollVote: Validator<PollVoteInput> = (input) =>
  objectInput(input, (payload) => {
    const optionId = requiredString(payload.optionId, 'optionId', 1, 120);
    const errors = errorsFrom(optionId);
    if (errors.length) return reject(errors);
    return pass({ optionId: valueFrom(optionId) });
  });

export interface StudentRoommateSwipeInput {
  profileId: string;
  direction: 'left' | 'right';
}

export interface StudentUniversityCreateInput {
  name: string;
  shortName: string;
  location: string;
  website?: string;
  reason?: string;
}

export const validateStudentUniversityCreate: Validator<StudentUniversityCreateInput> = (input) =>
  objectInput(input, (payload) => {
    const name = requiredString(payload.name, 'name', 3, 180);
    const shortName = requiredString(payload.shortName, 'shortName', 2, 24);
    const location = requiredString(payload.location, 'location', 3, 240);
    const website = optionalString(payload.website, 'website', 255);
    const reason = optionalString(payload.reason, 'reason', 1500);
    const errors = [
      ...errorsFrom(name),
      ...errorsFrom(shortName),
      ...errorsFrom(location),
      ...errorsFrom(website),
      ...errorsFrom(reason),
    ];
    if (errors.length) return reject(errors);
    return pass({
      name: valueFrom(name),
      shortName: valueFrom(shortName),
      location: valueFrom(location),
      website: valueFrom(website),
      reason: valueFrom(reason),
    });
  });

export const validateStudentRoommateSwipe: Validator<StudentRoommateSwipeInput> = (input) =>
  objectInput(input, (payload) => {
    const profileId = requiredString(payload.profileId, 'profileId', 1, 120);
    const direction = oneOf(payload.direction, 'direction', ['left', 'right']);
    const errors = [...errorsFrom(profileId), ...errorsFrom(direction)];
    if (errors.length) return reject(errors);
    return pass({
      profileId: valueFrom(profileId),
      direction: valueFrom(direction),
    });
  });

export interface GuideVoteInput {
  vote: -1 | 1;
}

export const validateGuideVote: Validator<GuideVoteInput> = (input) =>
  objectInput(input, (payload) => {
    const vote = oneOf(payload.vote, 'vote', ['-1', '1']);
    if (vote.ok) {
      return pass({ vote: Number(vote.value) as -1 | 1 });
    }

    const numericVote = payload.vote;
    if (numericVote === -1 || numericVote === 1) {
      return pass({ vote: numericVote });
    }

    return reject(['vote must be -1 or 1']);
  });

export interface OnboardingContentInput {
  userName: string;
  tribe: string;
  interest: string;
}

export const validateOnboardingContent: Validator<OnboardingContentInput> = (input) =>
  objectInput(input, (payload) => {
    const userName = requiredString(payload.userName, 'userName', 1, 80);
    const tribe = requiredString(payload.tribe, 'tribe', 1, 80);
    const interest = requiredString(payload.interest, 'interest', 1, 200);
    const errors = [...errorsFrom(userName), ...errorsFrom(tribe), ...errorsFrom(interest)];
    if (errors.length) return reject(errors);

    return pass({
      userName: valueFrom(userName),
      tribe: valueFrom(tribe),
      interest: valueFrom(interest),
    });
  });

export interface OnboardingFinalBanterInput {
  userName: string;
  tribe: string;
  interest: string;
  score: number;
  total: number;
}

export const validateOnboardingFinalBanter: Validator<OnboardingFinalBanterInput> = (input) =>
  objectInput(input, (payload) => {
    const userName = requiredString(payload.userName, 'userName', 1, 80);
    const tribe = requiredString(payload.tribe, 'tribe', 1, 80);
    const interest = requiredString(payload.interest, 'interest', 1, 200);
    const score = requiredNumber(payload.score, 'score', { min: 0, max: 20, integer: true });
    const total = requiredNumber(payload.total, 'total', { min: 1, max: 20, integer: true });
    const errors = [
      ...errorsFrom(userName),
      ...errorsFrom(tribe),
      ...errorsFrom(interest),
      ...errorsFrom(score),
      ...errorsFrom(total),
    ];
    if (valueFrom(score) > valueFrom(total)) {
      errors.push('score must be less than or equal to total');
    }
    if (errors.length) return reject(errors);

    return pass({
      userName: valueFrom(userName),
      tribe: valueFrom(tribe),
      interest: valueFrom(interest),
      score: valueFrom(score),
      total: valueFrom(total),
    });
  });

export interface ContractAnalyzeInput {
  documentName: string;
  documentText?: string;
  documentUrl?: string;
}

export const validateContractAnalyze: Validator<ContractAnalyzeInput> = (input) =>
  objectInput(input, (payload) => {
    const documentName = requiredString(payload.documentName, 'documentName', 1, 260);
    const documentText = optionalString(payload.documentText, 'documentText', 300_000);
    const documentUrl = optionalString(payload.documentUrl, 'documentUrl', 2048);
    const errors = [
      ...errorsFrom(documentName),
      ...errorsFrom(documentText),
      ...errorsFrom(documentUrl),
    ];
    if (!valueFrom(documentText) && !valueFrom(documentUrl)) {
      errors.push('Provide documentText or documentUrl');
    }
    if (errors.length) return reject(errors);

    return pass({
      documentName: valueFrom(documentName),
      documentText: valueFrom(documentText),
      documentUrl: valueFrom(documentUrl),
    });
  });

export interface DocumentAnalyzeInput {
  documentName: string;
  documentText?: string;
  documentUrl?: string;
}

export const validateDocumentAnalyze: Validator<DocumentAnalyzeInput> = (input) =>
  validateContractAnalyze(input);

export interface LawyerRequestInput {
  contractAnalysisId?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

export const validateLawyerRequest: Validator<LawyerRequestInput> = (input) =>
  objectInput(input, (payload) => {
    const contractAnalysisId = optionalString(
      payload.contractAnalysisId,
      'contractAnalysisId',
      120,
    );
    const contactEmail = optionalString(payload.contactEmail, 'contactEmail', 254);
    const contactPhone = optionalString(payload.contactPhone, 'contactPhone', 32);
    const notes = optionalString(payload.notes, 'notes', 4000);
    const errors = [
      ...errorsFrom(contractAnalysisId),
      ...errorsFrom(contactEmail),
      ...errorsFrom(contactPhone),
      ...errorsFrom(notes),
    ];
    const emailValue = valueFrom(contactEmail)?.trim();
    const phoneValue = valueFrom(contactPhone)?.trim();
    if (!emailValue && !phoneValue) {
      errors.push('Provide contactEmail or contactPhone');
    }
    if (emailValue && !emailValue.includes('@')) {
      errors.push('contactEmail must be a valid email');
    }
    if (errors.length) return reject(errors);

    return pass({
      contractAnalysisId: valueFrom(contractAnalysisId),
      contactEmail: valueFrom(contactEmail),
      contactPhone: valueFrom(contactPhone),
      notes: valueFrom(notes),
    });
  });

export interface MeProfileUpdateInput {
  displayName?: string;
  mood?: string;
  language?: string;
  bio?: string;
  notificationsEnabled?: boolean;
  tribe?: string;
  interest?: string;
  onboardingCompleted?: boolean;
}

export const validateMeProfileUpdate: Validator<MeProfileUpdateInput> = (input) =>
  objectInput(input, (payload) => {
    const displayName = optionalString(payload.displayName, 'displayName', 80);
    const mood = optionalString(payload.mood, 'mood', 40);
    const language = optionalString(payload.language, 'language', 10);
    const bio = optionalString(payload.bio, 'bio', 500);
    const tribe = optionalString(payload.tribe, 'tribe', 80);
    const interest = optionalString(payload.interest, 'interest', 200);
    const notificationsEnabled = optionalBoolean(
      payload.notificationsEnabled,
      'notificationsEnabled',
    );
    const onboardingCompleted = optionalBoolean(
      payload.onboardingCompleted,
      'onboardingCompleted',
    );

    const errors = [
      ...errorsFrom(displayName),
      ...errorsFrom(mood),
      ...errorsFrom(language),
      ...errorsFrom(bio),
      ...errorsFrom(tribe),
      ...errorsFrom(interest),
      ...errorsFrom(notificationsEnabled),
      ...errorsFrom(onboardingCompleted),
    ];

    if (errors.length) return reject(errors);

    return pass({
      displayName: valueFrom(displayName),
      mood: valueFrom(mood),
      language: valueFrom(language),
      bio: valueFrom(bio),
      tribe: valueFrom(tribe),
      interest: valueFrom(interest),
      notificationsEnabled: valueFrom(notificationsEnabled),
      onboardingCompleted: valueFrom(onboardingCompleted),
    });
  });

export interface MePreferencesUpdateInput {
  mood?: string;
  language?: string;
  notificationsEnabled?: boolean;
  morningBriefingSeenDate?: string;
  moodCheckSeenDate?: string;
}

export const validateMePreferencesUpdate: Validator<MePreferencesUpdateInput> = (input) =>
  objectInput(input, (payload) => {
    const mood = optionalString(payload.mood, 'mood', 40);
    const language = optionalString(payload.language, 'language', 10);
    const notificationsEnabled = optionalBoolean(
      payload.notificationsEnabled,
      'notificationsEnabled',
    );
    const morningBriefingSeenDate = optionalString(
      payload.morningBriefingSeenDate,
      'morningBriefingSeenDate',
      32,
    );
    const moodCheckSeenDate = optionalString(
      payload.moodCheckSeenDate,
      'moodCheckSeenDate',
      32,
    );
    const errors = [
      ...errorsFrom(mood),
      ...errorsFrom(language),
      ...errorsFrom(notificationsEnabled),
      ...errorsFrom(morningBriefingSeenDate),
      ...errorsFrom(moodCheckSeenDate),
    ];

    if (errors.length) return reject(errors);

    return pass({
      mood: valueFrom(mood),
      language: valueFrom(language),
      notificationsEnabled: valueFrom(notificationsEnabled),
      morningBriefingSeenDate: valueFrom(morningBriefingSeenDate),
      moodCheckSeenDate: valueFrom(moodCheckSeenDate),
    });
  });

export interface AIHubAdvisorInput {
  scenario: string;
}

export const validateAIHubAdvisor: Validator<AIHubAdvisorInput> = (input) =>
  objectInput(input, (payload) => {
    const scenario = requiredString(payload.scenario, 'scenario', 5, 2000);
    const errors = errorsFrom(scenario);
    if (errors.length) return reject(errors);
    return pass({ scenario: valueFrom(scenario) });
  });

export interface FlavorCheckinInput {
  restaurantId: string;
}

export const validateFlavorCheckin: Validator<FlavorCheckinInput> = (input) =>
  objectInput(input, (payload) => {
    const restaurantId = requiredString(payload.restaurantId, 'restaurantId', 1, 120);
    const errors = errorsFrom(restaurantId);
    if (errors.length) return reject(errors);
    return pass({ restaurantId: valueFrom(restaurantId) });
  });
