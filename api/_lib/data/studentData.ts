import type {
  RoommateProfileSummary,
  StudentEventSummary,
  StudentUniversitySummary,
} from '../../../src/services/api/types';
import type { StudentRoommateSwipeInput } from '../validation';
import { supabaseInsert, supabaseSelect, supabaseUpsert } from './supabaseRest';

interface StudentUniversityRow {
  id: string;
  name: string;
  short_name: string;
  logo: string;
  location: string;
  recent_topics?: string[] | null;
  verified?: boolean | null;
}

interface StudentMembershipRow {
  university_id: string;
  user_id: string;
  created_at: string;
}

interface StudentEventRow {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  attending_count: number;
  category: string;
}

interface StudentRoommateRow {
  id: string;
  name: string;
  university_name: string;
  country: string;
  looking_for: string;
  budget?: string | null;
  interests?: string[] | null;
  avatar?: string | null;
  verified?: boolean | null;
}

interface StudentSwipeRow {
  profile_id: string;
}

function fallbackUniversities(): StudentUniversitySummary[] {
  return [
    {
      id: 'student-uni-fallback-1',
      name: 'University of Warsaw',
      shortName: 'UW',
      logo: 'UW',
      activeStudents: 847,
      totalMembers: 3421,
      recentTopics: ['Spring semester registration', 'Erasmus application tips', 'Best cafes near campus'],
      location: 'Krakowskie Przedmiescie',
      verified: true,
    },
    {
      id: 'student-uni-fallback-2',
      name: 'Warsaw University of Technology',
      shortName: 'WUT',
      logo: 'WUT',
      activeStudents: 623,
      totalMembers: 2156,
      recentTopics: ['Engineering project partners', 'Lab schedule changes', 'Tech events this month'],
      location: 'Plac Politechniki',
      verified: true,
    },
  ];
}

function fallbackEvents(): StudentEventSummary[] {
  return [
    {
      id: 'student-event-fallback-1',
      title: 'International Students Meetup',
      date: 'Feb 12, 2026',
      time: '18:00',
      location: 'Cafe Kulturalna',
      attending: 89,
      category: 'Networking',
      rsvp: false,
    },
    {
      id: 'student-event-fallback-2',
      title: 'Study Group: Polish Language',
      date: 'Feb 11, 2026',
      time: '17:00',
      location: 'UW Main Library',
      attending: 34,
      category: 'Academic',
      rsvp: false,
    },
  ];
}

function fallbackRoommates(): RoommateProfileSummary[] {
  return [
    {
      id: 'student-roommate-fallback-1',
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
      id: 'student-roommate-fallback-2',
      name: 'Luca Rossi',
      university: 'University of Warsaw',
      country: 'Italy',
      lookingFor: 'Studio share in Centrum',
      budget: '2,000-2,500 PLN',
      interests: ['Sports', 'Tech', 'Photography'],
      avatar: 'L',
      verified: true,
    },
  ];
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function getStudentUniversitiesData(): Promise<StudentUniversitySummary[]> {
  const [universities, memberships] = await Promise.all([
    supabaseSelect<StudentUniversityRow>(
      'student_universities',
      'id,name,short_name,logo,location,recent_topics,verified',
      {
        limit: 300,
        orderBy: 'name',
        ascending: true,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    supabaseSelect<StudentMembershipRow>(
      'student_university_memberships',
      'university_id,user_id,created_at',
      {
        limit: 10000,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
  ]);

  if (!universities.length) return fallbackUniversities();

  const totalByUniversity = new Map<string, number>();
  const activeByUniversity = new Map<string, number>();
  const now = Date.now();
  const activeWindowMs = 24 * 60 * 60 * 1000;

  memberships.forEach((membership) => {
    totalByUniversity.set(
      membership.university_id,
      (totalByUniversity.get(membership.university_id) || 0) + 1,
    );

    const createdAt = new Date(membership.created_at).getTime();
    if (!Number.isNaN(createdAt) && now - createdAt <= activeWindowMs) {
      activeByUniversity.set(
        membership.university_id,
        (activeByUniversity.get(membership.university_id) || 0) + 1,
      );
    }
  });

  return universities.map((university) => {
    const totalMembers = totalByUniversity.get(university.id) || 0;
    const activeFromWindow = activeByUniversity.get(university.id) || 0;
    const inferredActive = totalMembers ? Math.max(1, Math.round(totalMembers * 0.25)) : 0;

    return {
      id: university.id,
      name: university.name,
      shortName: university.short_name,
      logo: university.logo || university.short_name,
      activeStudents: Math.max(activeFromWindow, inferredActive),
      totalMembers,
      recentTopics: university.recent_topics || [],
      location: university.location,
      verified: university.verified !== false,
    };
  });
}

export async function joinStudentUniversityData(universityId: string, userId: string): Promise<void> {
  await supabaseUpsert(
    'student_university_memberships',
    {
      university_id: universityId,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: 'university_id,user_id',
    },
  );
}

export async function getStudentEventsData(): Promise<StudentEventSummary[]> {
  const rows = await supabaseSelect<StudentEventRow>(
    'student_events',
    'id,title,event_date,event_time,location,attending_count,category',
    {
      limit: 300,
      orderBy: 'event_date',
      ascending: true,
      filters: [{ column: 'active', op: 'eq', value: true }],
    },
  );

  if (!rows.length) return fallbackEvents();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    date: formatDateLabel(row.event_date),
    time: row.event_time,
    location: row.location,
    attending: Number(row.attending_count || 0),
    category: row.category,
    rsvp: false,
  }));
}

export async function getStudentRoommatesData(
  viewerUserId?: string | null,
): Promise<RoommateProfileSummary[]> {
  const [roommates, swipes] = await Promise.all([
    supabaseSelect<StudentRoommateRow>(
      'student_roommates',
      'id,name,university_name,country,looking_for,budget,interests,avatar,verified',
      {
        limit: 300,
        orderBy: 'created_at',
        ascending: false,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    viewerUserId
      ? supabaseSelect<StudentSwipeRow>(
          'student_roommate_swipes',
          'profile_id',
          {
            limit: 1000,
            orderBy: 'created_at',
            ascending: false,
            filters: [{ column: 'swiper_user_id', op: 'eq', value: viewerUserId }],
          },
        )
      : Promise.resolve([]),
  ]);

  if (!roommates.length) return fallbackRoommates();

  const swipedProfileIds = new Set(swipes.map((swipe) => swipe.profile_id));

  const mapped = roommates
    .filter((row) => !viewerUserId || !swipedProfileIds.has(row.id))
    .map((row) => ({
      id: row.id,
      name: row.name,
      university: row.university_name,
      country: row.country,
      lookingFor: row.looking_for,
      budget: row.budget || undefined,
      interests: row.interests || [],
      avatar: (row.avatar || row.name.slice(0, 1) || 'U').slice(0, 2),
      verified: row.verified === true,
    }));

  return mapped.length ? mapped : fallbackRoommates();
}

export async function swipeStudentRoommateData(
  userId: string,
  input: StudentRoommateSwipeInput,
): Promise<void> {
  await supabaseUpsert(
    'student_roommate_swipes',
    {
      swiper_user_id: userId,
      profile_id: input.profileId,
      direction: input.direction,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: 'swiper_user_id,profile_id',
    },
  );
}

interface MatchRoommateRow {
  id: string;
}

export async function seedStudentRoommateIfMissing(
  userId: string,
  displayName = 'Expat User',
): Promise<void> {
  const existing = await supabaseSelect<MatchRoommateRow>(
    'student_roommates',
    'id',
    {
      limit: 1,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    },
  );

  if (existing.length) return;

  await supabaseInsert('student_roommates', {
    user_id: userId,
    name: displayName,
    university_name: 'University of Warsaw',
    country: 'Poland',
    looking_for: 'Roommate match',
    budget: '1,500-2,000 PLN',
    interests: ['Travel', 'Food'],
    avatar: displayName.slice(0, 1).toUpperCase() || 'U',
    verified: false,
    active: true,
  });
}
