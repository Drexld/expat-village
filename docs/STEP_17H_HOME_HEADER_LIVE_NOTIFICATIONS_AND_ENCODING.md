# Step 17H: Home Header Live Notifications + Encoding Cleanup

## Objective
Remove hardcoded Home header notification content and eliminate mojibake text that produced `??` glyphs on device builds.

## Changes Applied

### `src/components/Home.tsx`
- Removed static header notification count (`3`).
- Built header notifications from live runtime signals:
  - `/api/pulse/home` highlights
  - Home support Town Hall previews
  - Pending review prompt count (if present)
- Passed live notification items into `PremiumHeader`.

### `src/components/PremiumHeader.tsx`
- Replaced static notification catalog with `notificationItems` prop.
- Notification badge count now derives from live items.
- Notification panel now renders live items or explicit empty state.
- Cleaned all mojibake/encoding-corrupted strings in header copy.
- Added auto-hide timer for voice tooltip to reduce overlay persistence.
- Tightened notification panel width for mobile to avoid clipping/overlay issues.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.

## Notes
- This step removes another visible static runtime path from Home.
- Next sequence should continue with remaining static “Discover promo”/local helper cards and full feed freshness surfacing.
