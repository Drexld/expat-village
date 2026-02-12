import { apiGet, apiPost } from '../http';
import type {
  RoommateProfileSummary,
  StudentEventSummary,
  StudentRoommateSwipeInput,
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

export async function swipeStudentRoommate(input: StudentRoommateSwipeInput): Promise<void> {
  await apiPost<void>('/api/student/roommates/swipe', input);
}

