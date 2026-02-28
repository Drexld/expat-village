# Step 09: Student Hubs Live Core Migration

## Objective
Move Student Hubs to API-first runtime for universities, events, roommates, discounts, and groups; remove active fallback datasets and local static cards.

## Delivered
1. `src/services/api/types.ts`
   - Added student hub live contracts:
     - `StudentDiscountSummary`
     - `StudentGroupSummary`
     - `StudentUniversityCreateInput`

2. `src/services/api/repositories/studentRepository.ts`
   - Added live repository methods:
     - `getStudentDiscounts()`
     - `getStudentGroups()`
     - `joinStudentGroup(groupId)`
     - `createStudentUniversity(input)`

3. `src/services/api/hooks/useStudentHub.ts`
   - Removed frontend fallback universities/events/roommates datasets from active runtime path.
   - Added live `discounts` and `groups` feeds.
   - Added strict API-first actions:
     - `submitUniversity`
     - `joinGroup`
     - `joinUniversity`
     - `swipeRoommate`
   - Actions now throw when API is not configured.

4. `api/_lib/data/studentData.ts`
   - Removed backend fallback student data returns.
   - Added live data functions:
     - `getStudentDiscountsData()`
     - `getStudentGroupsData()`
     - `joinStudentGroupData(groupId, userId)`
     - `createStudentUniversityData(userId, input)`
   - Existing universities/events/roommates functions now return true empty arrays when no live data exists.

5. Student API routes
   - Updated `api/student/universities/index.ts` to support `POST` (submission flow) in addition to `GET`.
   - Added `api/student/discounts/index.ts` (`GET`).
   - Added `api/student/groups/index.ts` (`GET`).
   - Added `api/student/groups/[id]/join.ts` (`POST`, authenticated).

6. Validation
   - Added `validateStudentUniversityCreate` and input contract in `api/_lib/validation/contracts.ts`.

7. UI migration
   - `src/components/StudentHubs.tsx`
     - Removed static local `discounts` and `groups` arrays.
     - Connected tabs to live hook feeds.
     - Connected add-university submit and group join to backend actions.
     - Removed preview-mode write messaging.
     - Added explicit non-live/error/empty states for each tab.
   - `src/components/AddUniversityModal.tsx`
     - Converted from local toast-only behavior to real submit flow via `onSubmit`.
   - `src/components/UniversityModal.tsx`
     - Removed hardcoded discussions/events arrays.
     - Derives discussion items from live university topics and uses passed live event list.

8. Supabase migration
   - Added `supabase/migrations/20260213_000006_student_discounts_groups_and_submissions.sql`:
     - `student_discounts`
     - `student_groups`
     - `student_group_memberships`
     - `student_university_submissions`
     - RLS policies and update triggers.

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 09
- Student Hubs runtime data is API-first.
- Static fallback university/event/roommate/discount/group catalogs removed from active runtime flow.
- New student discounts/groups and university submission paths are live-backed with explicit empty/error states.
