import type { ValidationResult, Validator } from './types';

function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

function fail<T>(...errors: string[]): ValidationResult<T> {
  return { ok: false, errors };
}

export function asObject(input: unknown, label = 'payload'): ValidationResult<Record<string, unknown>> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return fail(`${label} must be an object`);
  }
  return ok(input as Record<string, unknown>);
}

export function requiredString(
  input: unknown,
  field: string,
  minLength = 1,
  maxLength = 4000,
): ValidationResult<string> {
  if (typeof input !== 'string') return fail(`${field} must be a string`);
  const value = input.trim();
  if (value.length < minLength) return fail(`${field} is required`);
  if (value.length > maxLength) return fail(`${field} exceeds max length ${maxLength}`);
  return ok(value);
}

export function optionalString(
  input: unknown,
  field: string,
  maxLength = 4000,
): ValidationResult<string | undefined> {
  if (input == null || input === '') return ok(undefined);
  if (typeof input !== 'string') return fail(`${field} must be a string`);
  const value = input.trim();
  if (value.length > maxLength) return fail(`${field} exceeds max length ${maxLength}`);
  return ok(value || undefined);
}

export function requiredNumber(
  input: unknown,
  field: string,
  options?: { min?: number; max?: number; integer?: boolean },
): ValidationResult<number> {
  if (typeof input !== 'number' || Number.isNaN(input)) {
    return fail(`${field} must be a number`);
  }
  if (options?.integer && !Number.isInteger(input)) {
    return fail(`${field} must be an integer`);
  }
  if (typeof options?.min === 'number' && input < options.min) {
    return fail(`${field} must be >= ${options.min}`);
  }
  if (typeof options?.max === 'number' && input > options.max) {
    return fail(`${field} must be <= ${options.max}`);
  }
  return ok(input);
}

export function optionalBoolean(input: unknown, field: string): ValidationResult<boolean | undefined> {
  if (input == null) return ok(undefined);
  if (typeof input !== 'boolean') return fail(`${field} must be boolean`);
  return ok(input);
}

export function oneOf<T extends string>(input: unknown, field: string, allowed: readonly T[]): ValidationResult<T> {
  if (typeof input !== 'string') return fail(`${field} must be a string`);
  if (!allowed.includes(input as T)) {
    return fail(`${field} must be one of: ${allowed.join(', ')}`);
  }
  return ok(input as T);
}

export function optionalStringArray(
  input: unknown,
  field: string,
  options?: { maxItems?: number; itemMaxLength?: number },
): ValidationResult<string[] | undefined> {
  if (input == null) return ok(undefined);
  if (!Array.isArray(input)) return fail(`${field} must be an array`);
  const maxItems = options?.maxItems ?? 20;
  const itemMaxLength = options?.itemMaxLength ?? 100;
  if (input.length > maxItems) return fail(`${field} exceeds max items ${maxItems}`);

  const output: string[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const item = input[i];
    if (typeof item !== 'string') return fail(`${field}[${i}] must be a string`);
    const normalized = item.trim();
    if (!normalized) continue;
    if (normalized.length > itemMaxLength) {
      return fail(`${field}[${i}] exceeds max length ${itemMaxLength}`);
    }
    output.push(normalized);
  }

  return ok(output);
}

export function parseJsonBody<T>(request: Request, validator?: Validator<T>): Promise<ValidationResult<T>> {
  return request
    .json()
    .then((input) => {
      if (!validator) {
        return ok(input as T);
      }
      return validator(input);
    })
    .catch(() => fail<T>('Invalid JSON body'));
}
