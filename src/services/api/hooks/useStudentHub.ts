import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  createStudentUniversity,
  getStudentDiscounts,
  getStudentEvents,
  getStudentGroups,
  getStudentRoommates,
  getStudentUniversities,
  joinStudentGroup,
  joinStudentUniversity,
  swipeStudentRoommate,
} from '../repositories/studentRepository';
import type {
  RoommateProfileSummary,
  StudentDiscountSummary,
  StudentEventSummary,
  StudentGroupSummary,
  StudentRoommateSwipeInput,
  StudentUniversityCreateInput,
  StudentUniversitySummary,
} from '../types';

interface UseStudentHubOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseStudentHubResult {
  universities: StudentUniversitySummary[];
  events: StudentEventSummary[];
  roommates: RoommateProfileSummary[];
  discounts: StudentDiscountSummary[];
  groups: StudentGroupSummary[];
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  joinUniversity: (universityId: string) => Promise<void>;
  submitUniversity: (input: StudentUniversityCreateInput) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  swipeRoommate: (input: StudentRoommateSwipeInput) => Promise<void>;
}

export function useStudentHub(options: UseStudentHubOptions = {}): UseStudentHubResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [universities, setUniversities] = useState<StudentUniversitySummary[]>([]);
  const [events, setEvents] = useState<StudentEventSummary[]>([]);
  const [roommates, setRoommates] = useState<RoommateProfileSummary[]>([]);
  const [discounts, setDiscounts] = useState<StudentDiscountSummary[]>([]);
  const [groups, setGroups] = useState<StudentGroupSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        if (!universities.length && !events.length && !roommates.length && !discounts.length && !groups.length) {
          setIsLoading(true);
        }

        const [universitiesResult, eventsResult, roommatesResult, discountsResult, groupsResult] = await Promise.allSettled([
          getStudentUniversities(),
          getStudentEvents(),
          getStudentRoommates(),
          getStudentDiscounts(),
          getStudentGroups(),
        ]);

        if (!mounted) return;

        setUniversities(universitiesResult.status === 'fulfilled' ? universitiesResult.value : []);
        setEvents(eventsResult.status === 'fulfilled' ? eventsResult.value : []);
        setRoommates(roommatesResult.status === 'fulfilled' ? roommatesResult.value : []);
        setDiscounts(discountsResult.status === 'fulfilled' ? discountsResult.value : []);
        setGroups(groupsResult.status === 'fulfilled' ? groupsResult.value : []);

        const hasRejected =
          universitiesResult.status === 'rejected' ||
          eventsResult.status === 'rejected' ||
          roommatesResult.status === 'rejected' ||
          discountsResult.status === 'rejected' ||
          groupsResult.status === 'rejected';

        setError(hasRejected ? new Error('Some student hub feeds are unavailable.') : null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load student hub data'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchData();
    const interval = window.setInterval(fetchData, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [
    shouldFetch,
    refreshIntervalMs,
    universities.length,
    events.length,
    roommates.length,
    discounts.length,
    groups.length,
  ]);

  const joinUniversityAction = async (universityId: string) => {
    if (!shouldFetch) {
      throw new Error('Student Hub API is not configured.');
    }
    await joinStudentUniversity(universityId);
  };

  const submitUniversityAction = async (input: StudentUniversityCreateInput) => {
    if (!shouldFetch) {
      throw new Error('Student Hub API is not configured.');
    }
    await createStudentUniversity(input);
  };

  const joinGroupAction = async (groupId: string) => {
    if (!shouldFetch) {
      throw new Error('Student Hub API is not configured.');
    }
    await joinStudentGroup(groupId);
  };

  const swipeRoommateAction = async (input: StudentRoommateSwipeInput) => {
    if (!shouldFetch) {
      throw new Error('Student Hub API is not configured.');
    }
    await swipeStudentRoommate(input);
  };

  return useMemo(
    () => ({
      universities,
      events,
      roommates,
      discounts,
      groups,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(lastSyncedAt),
      lastSyncedAt,
      joinUniversity: joinUniversityAction,
      submitUniversity: submitUniversityAction,
      joinGroup: joinGroupAction,
      swipeRoommate: swipeRoommateAction,
    }),
    [universities, events, roommates, discounts, groups, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
