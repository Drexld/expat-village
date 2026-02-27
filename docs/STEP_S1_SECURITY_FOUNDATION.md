# Step S1: Security Foundation

## Objective
Implement the minimum production security baseline across API and runtime without breaking current UI/UX behavior.

This step operationalizes the first phase of `docs/SECURITY_INFRASTRUCTURE_PLAN.md`.

## Scope (This Step Only)
1. API security middleware baseline.
2. Request schema validation baseline.
3. Security headers and CORS restrictions.
4. Rate limiting and abuse guard baseline.
5. Security logging/audit event baseline.

## Deliverables

### 1. Security middleware layer
- Add centralized middleware stack for `/api/*`:
  - auth extraction/verification
  - role/entitlement guard hooks (no-op for unprotected routes yet)
  - request correlation ID
  - uniform error mapping

What this gives us:
- one enforcement point for authn/authz policies
- consistent error and trace behavior

### 2. Input validation for current endpoints
- Add strict schema validation for all existing contracts:
  - `/api/community/*`
  - `/api/marketplace/*`
  - `/api/services/*`
  - `/api/tasks/*`
  - `/api/polls/*`
  - `/api/ai/*`

What this gives us:
- rejection of malformed or unsafe payloads
- reduced injection and logic abuse surface

### 3. Security headers + CORS
- Enforce:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Restrict CORS to trusted origins only (dev + preview + prod allowlist).

What this gives us:
- browser-level hardening against common web attacks

### 4. Rate limiting baseline
- Add endpoint classes:
  - strict: auth/session and AI endpoints
  - medium: write endpoints (post/review/vote/upload init)
  - relaxed: read endpoints
- Apply IP + user-keyed limits with standard `429` responses.

What this gives us:
- first-line abuse protection and cost control

### 5. Security logging baseline
- Log structured security events:
  - auth failures
  - rate-limit hits
  - schema validation failures
  - permission denials
- Redact sensitive fields by default.

What this gives us:
- traceability for incident response and abuse analysis

## Acceptance Criteria (Go/No-Go)
1. All active `/api/*` routes pass schema validation tests.
2. Unauthorized requests to protected test routes return `401/403` as expected.
3. Header scan confirms required security headers on API responses.
4. CORS rejects untrusted origin requests.
5. Rate limiting returns deterministic `429` under load test.
6. Security logs capture events with correlation IDs and no raw sensitive payload leakage.

## Non-Breaking Guarantee for Step S1
- No UI component structure, animations, or layout changes.
- No visual design token/class changes.
- Existing frontend flows remain functionally identical for valid requests.
- Security controls should only affect invalid, abusive, or unauthorized traffic.

## Risks and Controls
1. Risk: Overly strict validation blocks legitimate requests.
   - Control: start in monitor mode for selected routes, then enforce.
2. Risk: CORS misconfiguration breaks preview/prod.
   - Control: explicit environment allowlist and deployment smoke test.
3. Risk: Rate limits impact normal users.
   - Control: tiered limits + per-endpoint tuning with observability.

## Verification Plan
1. Local smoke:
   - run API endpoints with valid and invalid payloads.
   - confirm expected status and error shape.
2. Preview smoke:
   - verify web app reads/writes still succeed for normal traffic.
   - verify rejected malicious patterns are logged.
3. Security checks:
   - header validation
   - CORS validation
   - rate-limit burst validation

## Next Step (S2)
Identity and policy hardening:
1. MFA for privileged roles.
2. Full role + entitlement matrix enforcement.
3. Session security controls and audit expansion.

## Delivered in Current Iteration
1. Security foundation library:
   - `api/_lib/security/types.ts`
   - `api/_lib/security/errors.ts`
   - `api/_lib/security/constants.ts`
   - `api/_lib/security/response.ts`
   - `api/_lib/security/cors.ts`
   - `api/_lib/security/rateLimit.ts`
   - `api/_lib/security/auth.ts`
   - `api/_lib/security/audit.ts`
   - `api/_lib/security/validation.ts`
   - `api/_lib/security/middleware.ts`
   - `api/_lib/security/policies.ts`
   - `api/_lib/security/index.ts`
2. Endpoint contract validators:
   - `api/_lib/validation/contracts.ts`
   - `api/_lib/validation/index.ts`
3. Deployment hardening config:
   - `vercel.json` security headers baseline
4. Environment contract update:
   - `.env.example` security and rate-limit variables
5. Security verification gate:
   - `scripts/security-smoke.mjs`
   - `npm run security:smoke <base-url>`
6. Verification:
   - `npm run typecheck` passed
   - `npm run build` passed
