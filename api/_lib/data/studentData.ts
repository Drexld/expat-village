import type {
  RoommateProfileSummary,
  StudentDiscountSummary,
  StudentEventSummary,
  StudentGroupSummary,
  StudentUniversitySummary,
} from '../../../src/services/api/types';
import type {
  StudentRoommateSwipeInput,
  StudentUniversityCreateInput,
} from '../validation';
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

interface StudentDiscountRow {
  id: string;
  name: string;
  discount_text: string;
  category: string;
  distance_text?: string | null;
  valid_until?: string | null;
}

interface StudentGroupRow {
  id: string;
  name: string;
  category: string;
  active?: boolean | null;
}

interface StudentGroupMembershipRow {
  group_id: string;
  created_at: string;
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

function formatDateOrOngoing(value?: string | null): string {
  if (!value) return 'Ongoing';
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

  if (!universities.length) return [];

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

export async function createStudentUniversityData(
  userId: string,
  input: StudentUniversityCreateInput,
): Promise<void> {
  await supabaseInsert('student_university_submissions', {
    user_id: userId,
    name: input.name,
    short_name: input.shortName,
    location: input.location,
    website: input.website || null,
    reason: input.reason || null,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
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

  if (!rows.length) return [];

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

  if (!roommates.length) return [];

  const swipedProfileIds = new Set(swipes.map((swipe) => swipe.profile_id));

  return roommates
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
}

export async function getStudentDiscountsData(): Promise<StudentDiscountSummary[]> {
  const rows = await supabaseSelect<StudentDiscountRow>(
    'student_discounts',
    'id,name,discount_text,category,distance_text,valid_until',
    {
      limit: 300,
      orderBy: 'created_at',
      ascending: false,
      filters: [{ column: 'active', op: 'eq', value: true }],
    },
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    discount: row.discount_text,
    category: row.category,
    distance: row.distance_text || 'Nearby',
    validUntil: formatDateOrOngoing(row.valid_until),
  }));
}

export async function getStudentGroupsData(): Promise<StudentGroupSummary[]> {
  const [groups, memberships] = await Promise.all([
    supabaseSelect<StudentGroupRow>(
      'student_groups',
      'id,name,category,active',
      {
        limit: 300,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
    supabaseSelect<StudentGroupMembershipRow>(
      'student_group_memberships',
      'group_id,created_at',
      {
        limit: 20000,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
  ]);

  const membersByGroup = new Map<string, number>();
  memberships.forEach((membership) => {
    membersByGroup.set(membership.group_id, (membersByGroup.get(membership.group_id) || 0) + 1);
  });

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    members: membersByGroup.get(group.id) || 0,
    category: group.category,
    active: group.active !== false,
  }));
}

export async function joinStudentGroupData(groupId: string, userId: string): Promise<void> {
  await supabaseUpsert(
    'student_group_memberships',
    {
      group_id: groupId,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: 'group_id,user_id',
    },
  );
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
