import { apiGet, apiPost } from '../http';
import type {
  RoommateProfileSummary,
  StudentDiscountSummary,
  StudentEventSummary,
  StudentGroupSummary,
  StudentRoommateSwipeInput,
  StudentUniversityCreateInput,
  StudentUniversitySummary,
} from '../types';

export async function getStudentUniversities(): Promise<StudentUniversitySummary[]> {
  return apiGet<StudentUniversitySummary[]>('/api/student/universities');
}

export async function joinStudentUniversity(universityId: string): Promise<void> {
  await apiPost<void>(`/api/student/universities/${universityId}/join`);
}

export async function getStudentEvents(): Promise<StudentEventSummary[]> {
  return apiGet<StudentEventSummary[]>('/api/student/events');
}

export async function getStudentRoommates(): Promise<RoommateProfileSummary[]> {
  return apiGet<RoommateProfileSummary[]>('/api/student/roommates');
}

export async function getStudentDiscounts(): Promise<StudentDiscountSummary[]> {
  return apiGet<StudentDiscountSummary[]>('/api/student/discounts');
}

export async function getStudentGroups(): Promise<StudentGroupSummary[]> {
  return apiGet<StudentGroupSummary[]>('/api/student/groups');
}

export async function joinStudentGroup(groupId: string): Promise<void> {
  await apiPost<void>(`/api/student/groups/${groupId}/join`);
}

export async function createStudentUniversity(input: StudentUniversityCreateInput): Promise<void> {
  await apiPost<void>('/api/student/universities', input);
}

export async function swipeStudentRoommate(input: StudentRoommateSwipeInput): Promise<void> {
  await apiPost<void>('/api/student/roommates/swipe', input);
}
