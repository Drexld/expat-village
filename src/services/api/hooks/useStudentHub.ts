import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  getStudentEvents,
  getStudentRoommates,
  getStudentUniversities,
  joinStudentUniversity,
  swipeStudentRoommate,
} from '../repositories/studentRepository';
import type {
  RoommateProfileSummary,
  StudentEventSummary,
  StudentRoommateSwipeInput,
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
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  joinUniversity: (universityId: string) => Promise<void>;
  swipeRoommate: (input: StudentRoommateSwipeInput) => Promise<void>;
}

const fallbackUniversities: StudentUniversitySummary[] = [
  {
    id: '1',
    name: 'University of Warsaw',
    shortName: 'UW',
    logo: '🎓',
    activeStudents: 847,
    totalMembers: 3421,
    recentTopics: ['Spring semester registration', 'Erasmus application tips', 'Best cafes near campus'],
    location: 'Krakowskie Przedmiescie',
    verified: true,
  },
  {
    id: '2',
    name: 'Warsaw University of Technology',
    shortName: 'WUT',
    logo: '🔬',
    activeStudents: 623,
    totalMembers: 2156,
    recentTopics: ['Engineering project partners', 'Lab schedule changes', 'Tech events this month'],
    location: 'Plac Politechniki',
    verified: true,
  },
  {
    id: '3',
    name: 'SGH Warsaw School of Economics',
    shortName: 'SGH',
    logo: '📊',
    activeStudents: 412,
    totalMembers: 1834,
    recentTopics: ['Finance internships', 'Study group for econometrics', 'Career fair Feb 15'],
    location: 'al. Niepodleglosci',
    verified: true,
  },
];

const fallbackEvents: StudentEventSummary[] = [
  {
    id: '1',
    title: 'Erasmus Welcome Party',
    date: 'Feb 15, 2026',
    time: '20:00',
    location: 'Level 27, Zlota 44',
    attending: 156,
    category: 'Social',
    rsvp: false,
  },
  {
    id: '2',
    title: 'International Students Meetup',
    date: 'Feb 12, 2026',
    time: '18:00',
    location: 'Cafe Kulturalna',
    attending: 89,
    category: 'Networking',
    rsvp: false,
  },
  {
    id: '3',
    title: 'Study Group: Polish Language',
    date: 'Feb 11, 2026',
    time: '17:00',
    location: 'UW Main Library',
    attending: 34,
    category: 'Academic',
    rsvp: false,
  },
];

const fallbackRoommates: RoommateProfileSummary[] = [
  {
    id: '1',
    name: 'Sofia Martinez',
    university: 'University of Warsaw',
    country: 'Spain',
    lookingFor: 'Roommate in Mokotow',
    budget: '1,500-2,000 PLN',
    interests: ['Music', 'Travel', 'Cooking'],
    avatar: 'S',
    verified: true,
  },
  {
    id: '2',
    name: 'Luca Rossi',
    university: 'University of Warsaw',
    country: 'Italy',
    lookingFor: 'Studio share in Centrum',
    budget: '2,000-2,500 PLN',
    interests: ['Sports', 'Tech', 'Photography'],
    avatar: 'L',
    verified: true,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    university: 'University of Warsaw',
    country: 'India',
    lookingFor: 'Room near campus',
    budget: '1,200-1,800 PLN',
    interests: ['Reading', 'Yoga', 'Food'],
    avatar: 'P',
    verified: false,
  },
];

export function useStudentHub(options: UseStudentHubOptions = {}): UseStudentHubResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [universities, setUniversities] = useState<StudentUniversitySummary[]>([]);
  const [events, setEvents] = useState<StudentEventSummary[]>([]);
  const [roommates, setRoommates] = useState<RoommateProfileSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) {
      setUniversities(fallbackUniversities);
      setEvents(fallbackEvents);
      setRoommates(fallbackRoommates);
      setLastSyncedAt(new Date().toISOString());
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      try {
        if (!universities.length && !events.length && !roommates.length) setIsLoading(true);

        const [universitiesResult, eventsResult, roommatesResult] = await Promise.allSettled([
          getStudentUniversities(),
          getStudentEvents(),
          getStudentRoommates(),
        ]);

        if (!mounted) return;

        setUniversities(
          universitiesResult.status === 'fulfilled' && universitiesResult.value.length
            ? universitiesResult.value
            : fallbackUniversities,
        );
        setEvents(
          eventsResult.status === 'fulfilled' && eventsResult.value.length
            ? eventsResult.value
            : fallbackEvents,
        );
        setRoommates(
          roommatesResult.status === 'fulfilled' && roommatesResult.value.length
            ? roommatesResult.value
            : fallbackRoommates,
        );

        const hasRejected =
          universitiesResult.status === 'rejected' ||
          eventsResult.status === 'rejected' ||
          roommatesResult.status === 'rejected';
        setError(hasRejected ? new Error('Some student feeds are unavailable. Using fallback data.') : null);
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
  }, [shouldFetch, refreshIntervalMs]);

  const joinUniversityAction = async (universityId: string) => {
    if (!shouldFetch) return;
    await joinStudentUniversity(universityId);
  };

  const swipeRoommateAction = async (input: StudentRoommateSwipeInput) => {
    if (!shouldFetch) return;
    await swipeStudentRoommate(input);
  };

  return useMemo(
    () => ({
      universities,
      events,
      roommates,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(lastSyncedAt),
      lastSyncedAt,
      joinUniversity: joinUniversityAction,
      swipeRoommate: swipeRoommateAction,
    }),
    [universities, events, roommates, isLoading, error, shouldFetch, lastSyncedAt],
  );
}

