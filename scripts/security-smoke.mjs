#!/usr/bin/env node

const argvBase = process.argv[2];
const envBase = process.env.SECURITY_SMOKE_BASE_URL;
const baseUrl = (argvBase || envBase || '').trim().replace(/\/+$/, '');

if (!baseUrl) {
  console.error('Missing base URL. Usage: node scripts/security-smoke.mjs <base-url>');
  process.exit(1);
}

const sameOrigin = new URL(baseUrl).origin;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertHeader(response, headerName) {
  const value = response.headers.get(headerName);
  assert(Boolean(value), `Missing required header: ${headerName}`);
}

async function run(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function checkHeadersAndCors() {
  const response = await fetch(`${baseUrl}/api/pulse/home`, {
    method: 'GET',
    headers: {
      Origin: sameOrigin,
    },
  });

  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assertHeader(response, 'content-security-policy');
  assertHeader(response, 'strict-transport-security');
  assertHeader(response, 'x-frame-options');
  assertHeader(response, 'referrer-policy');
  assertHeader(response, 'permissions-policy');
  assertHeader(response, 'x-content-type-options');
  assertHeader(response, 'x-request-id');
  assert(response.headers.get('access-control-allow-origin') === sameOrigin, 'CORS allow-origin mismatch');
}

async function checkPreflight() {
  const response = await fetch(`${baseUrl}/api/pulse/home`, {
    method: 'OPTIONS',
    headers: {
      Origin: sameOrigin,
      'Access-Control-Request-Method': 'GET',
    },
  });

  assert(response.status === 204, `Expected 204 preflight, got ${response.status}`);
  assert(response.headers.get('access-control-allow-origin') === sameOrigin, 'Preflight allow-origin mismatch');
}

async function checkAuthGuard() {
  const response = await fetch(`${baseUrl}/api/me`, { method: 'GET', headers: { Origin: sameOrigin } });
  assert(response.status === 401, `Expected 401 for protected route, got ${response.status}`);
}

function buildUnverifiedToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: 'security-smoke-user' })).toString('base64url');
  return `${header}.${payload}.`;
}

async function checkValidationOrAuthRejection() {
  const response = await fetch(`${baseUrl}/api/community/posts`, {
    method: 'POST',
    headers: {
      Origin: sameOrigin,
      Authorization: `Bearer ${buildUnverifiedToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  assert(
    response.status === 400 || response.status === 401,
    `Expected 400 (validation) or 401 (strict auth), got ${response.status}`,
  );
}

async function checkRateLimit() {
  let saw429 = false;
  for (let i = 0; i < 50; i += 1) {
    const response = await fetch(`${baseUrl}/api/community/posts`, {
      method: 'POST',
      headers: {
        Origin: sameOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (response.status === 429) {
      saw429 = true;
      break;
    }
  }

  assert(saw429, 'Did not observe 429 under burst test');
}

async function main() {
  await run('security headers + CORS', checkHeadersAndCors);
  await run('CORS preflight', checkPreflight);
  await run('auth guard', checkAuthGuard);
  await run('validation/auth rejection', checkValidationOrAuthRejection);
  await run('rate limit', checkRateLimit);
  console.log('Security smoke checks passed.');
}

main().catch(() => {
  process.exit(1);
});
