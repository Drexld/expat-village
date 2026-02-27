# Security Infrastructure Plan

## Objective
Build a production-grade, defense-in-depth security architecture for Expat Village covering subscriptions, sensitive uploads (documents/contacts), AI processing, community content, and PWA deployment.

## Security Principles
1. Zero trust between client and server.
2. Least privilege at every layer (user, service, admin).
3. Default deny, explicit allow.
4. Sensitive data minimization and retention control.
5. Server-side enforcement for auth, billing, AI, and uploads.
6. Auditability for all critical actions.

## Threat Model (Primary Risks)
1. Account takeover (credential stuffing, session theft).
2. Unauthorized data access due to weak RLS/policy gaps.
3. Malicious file upload (malware, parser attacks, payload obfuscation).
4. Prompt injection via uploaded legal documents.
5. Sensitive data leakage through logs, analytics, or model prompts.
6. Subscription bypass or entitlement tampering.
7. Abuse/spam across AI, community, and upload endpoints.
8. Webhook spoofing for billing events.
9. Supply chain vulnerabilities in dependencies or CI.

## Target Security Architecture

### Trust Boundaries
1. Client (PWA) is untrusted.
2. Backend API is policy enforcement point.
3. Supabase/Postgres is source of truth and data policy engine via RLS.
4. AI providers are external untrusted processors.
5. Billing provider is external trusted by signature verification only.

### Data Flow Guardrails
1. Client never calls AI providers directly.
2. Client never receives service-role keys.
3. All uploads go through backend-issued short-lived signed URLs.
4. All sensitive reads use user-scoped auth + policy checks.
5. Billing state only updated from verified webhooks.

## Identity, Auth, and Session Security
1. Use Supabase Auth with short-lived access tokens and refresh rotation.
2. Enforce MFA for privileged roles (`support`, `moderator`, `admin`).
3. Use role + entitlement split:
   - Role controls permission class.
   - Entitlement controls subscription feature access.
4. Require backend authorization checks on every write path.
5. Revoke sessions on password reset, suspicious login, or manual admin action.
6. Add device/session listing with remote session revocation.
7. Add brute-force and credential-stuffing protections:
   - IP + account rate limits.
   - Temporary lockout and challenge flow.

## Authorization and Entitlements
1. Define permission matrix by endpoint and action.
2. Enforce policy middleware on every `/api/*` route.
3. Subscription gates must be server-derived:
   - `canUploadDocuments`
   - `canRunContractAI`
   - `canRequestLawyerReview`
   - `canAccessPremiumGuides`
4. Deny-by-default for unknown or expired subscription states.
5. Add authorization tests for each protected endpoint.

## Data Classification and Retention

### Data Classes
1. Public: guides, non-sensitive polls, curated updates.
2. Internal: operational telemetry and health metadata.
3. Sensitive: profile metadata, uploads, legal analysis output.
4. Restricted: payment and legal document metadata, contact imports.

### Retention Policy
1. Raw uploaded documents: short retention (for example 30/90 days configurable).
2. AI derived summaries: retain longer than raw files where possible.
3. Contact imports: explicit consent + revocable + delete-on-request.
4. Audit logs: immutable retention window (for example 12-24 months).
5. Automatic deletion jobs with evidence logs.

## Upload and Storage Security (Documents and Contacts)
1. Upload flow:
   - Backend validates request and issues signed upload URL.
   - Upload lands in quarantine storage.
   - Malware scan + MIME sniff + extension/signature validation.
   - Only clean files moved to protected storage.
2. Enforce strict limits:
   - Allowed MIME types.
   - Max size per file and per user/day.
   - File count limits.
3. Use object-level ownership metadata and deny public access.
4. Download via short-lived signed URLs only.
5. Strip or sanitize metadata (EXIF and embedded fields where applicable).
6. Hash each file for duplicate detection and incident triage.
7. Encrypt sensitive structured payloads (contacts) at field level where needed.

## AI Security and Safety Controls
1. Implement a centralized AI gateway service on backend.
2. Pre-processing:
   - PII redaction where not required for analysis.
   - Prompt-injection scanning and isolation of instructions from content.
3. Strong prompt templates:
   - Fixed system policy for legal framework `PL`.
   - No tool execution without explicit server policy.
4. Output controls:
   - JSON schema validation.
   - Confidence and uncertainty labels.
   - Unsafe/invalid output fallback path.
5. Logging policy:
   - Log request IDs, model version, latency, token usage.
   - Do not log raw sensitive document text by default.
6. Human-in-the-loop:
   - Lawyer review requests create immutable audit records.
   - Workflow states: `requested -> triaged -> assigned -> completed`.

## Billing and Subscription Security
1. Stripe integration server-side only.
2. Webhook signature verification mandatory.
3. Idempotency keys for all billing state transitions.
4. Entitlements updated only from verified events.
5. Handle race conditions and replay safely:
   - Ignore stale event versions.
   - Persist webhook event IDs.
6. No trust in frontend query params for payment outcome.
7. Add billing anomaly alerts (sudden churn, repeat webhook failures).

## API Security Hardening
1. Validate all request bodies/params with strict schema validators.
2. Apply endpoint-specific rate limits:
   - Auth endpoints (strict).
   - AI endpoints (quota + cost caps).
   - Upload endpoints (burst + daily limits).
3. Implement anti-abuse controls:
   - Bot management/challenge for suspicious traffic.
   - IP reputation and geo anomaly checks.
4. Set security headers:
   - CSP
   - HSTS
   - X-Frame-Options
   - Referrer-Policy
   - Permissions-Policy
5. Restrict CORS to known origins.
6. Sanitize community content before rendering (XSS prevention).
7. Disable caching of sensitive API responses in service worker.

## Database and Supabase Security
1. Enable and test RLS on all sensitive tables.
2. Use explicit policies for user ownership and role exceptions.
3. No service-role usage in frontend code.
4. Separate operational/service accounts for ingestion jobs.
5. Encrypt backups and enable point-in-time recovery.
6. Add migration review checklist:
   - New table RLS enabled.
   - Policies defined.
   - No wildcard public access.
7. Add policy regression tests in CI.

## PWA and Client Security
1. Keep manifest and icon assets trusted and versioned.
2. Ensure service worker does not persist sensitive API payloads unnecessarily.
3. Clear auth-sensitive caches on logout.
4. Protect local/session storage usage:
   - No secrets in storage.
   - Minimal, non-sensitive session hints only.
5. Use secure context only for sensitive flows.

## Observability, Monitoring, and Incident Response
1. Centralize logs with PII redaction.
2. Mandatory audit events:
   - Login/session changes
   - Upload events
   - AI request lifecycle
   - Billing entitlement updates
   - Admin/support actions
3. Real-time alerts:
   - Auth anomaly spikes
   - Upload malware detections
   - Webhook verification failures
   - AI cost spikes
4. Incident runbooks:
   - Account takeover
   - Data exposure suspicion
   - Compromised key/secret
   - Malicious upload campaign
5. Key rotation process with defined intervals.

## Compliance Baseline (EU/Poland)
1. GDPR controls:
   - Lawful basis
   - Consent records
   - DSAR export/delete flows
2. Data processing agreements with AI, storage, and billing vendors.
3. Transparent privacy notice for AI document handling and retention.
4. Residency strategy and transfer safeguards.
5. Consent and revocation for contact import/review prompts.

## Secure SDLC Requirements
1. Branch protection and required reviews for auth/RLS/billing/security files.
2. SAST + dependency scanning in CI.
3. Secret scanning pre-commit and CI.
4. IaC/config scanning for deployment settings.
5. Staging penetration test before production launch.
6. Security checklist gate on every release candidate.

## Implementation Roadmap (Step-by-Step)

### Phase S1: Foundations
1. Introduce security middleware (authz, entitlement, rate limiting).
2. Add strict schema validation on all existing API endpoints.
3. Enforce secure headers and CORS policy.

### Phase S2: Identity and Policy
1. Finalize role and entitlement model.
2. Add MFA for privileged roles.
3. Add auth/session audit trail.

### Phase S3: Upload Security
1. Build signed upload + quarantine pipeline.
2. Integrate malware scanning and validation.
3. Add secure download URL service.

### Phase S4: AI Gateway Security
1. Move all AI calls behind backend gateway.
2. Add prompt injection guardrails and output schema checks.
3. Enforce Polish-law contract policy and auditable request lifecycle.

### Phase S5: Billing and Entitlements
1. Harden Stripe webhook processing and idempotency.
2. Drive entitlements from backend state.
3. Add abuse controls for premium feature misuse.

### Phase S6: Data Governance and Compliance
1. Implement retention jobs and deletion automation.
2. Add DSAR export/delete endpoints.
3. Finalize compliance documentation and DPA tracking.

### Phase S7: Monitoring and IR
1. Deploy security alerting dashboard.
2. Test incident runbooks via tabletop exercises.
3. Add post-incident review template and tracking.

## Security Release Gates (Must Pass Before Full Launch)
1. RLS policy test suite passes.
2. Upload malware scan path verified end-to-end.
3. No direct client-side AI secret usage.
4. Billing webhooks verified and replay-safe.
5. Rate limiting and WAF policies active.
6. PII-safe logging and alerting active.
7. GDPR delete/export flow validated.
8. External security test findings triaged and criticals resolved.

## Ownership Matrix
1. Backend/API Security: API team.
2. Database/RLS: data platform team.
3. Upload/Storage controls: platform team.
4. AI safety and policy: AI team + legal ops.
5. Billing security: payments team.
6. Compliance and privacy: legal/privacy owner.
7. Incident response readiness: SRE/security owner.

## Deliverables
1. Security architecture diagram (trust boundaries and data flows).
2. Endpoint authorization matrix.
3. RLS policy catalog and tests.
4. Upload threat model and scan SOP.
5. AI safety policy and evaluation checklist.
6. Billing webhook hardening checklist.
7. Incident response runbooks.
8. Security release checklist integrated into CI/CD.
