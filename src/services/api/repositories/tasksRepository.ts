import { apiGet, apiPatch } from '../http';
import type { ChecklistTasksResponse, TaskStatusUpdateInput } from '../types';

export async function getTasks(): Promise<ChecklistTasksResponse> {
  return apiGet<ChecklistTasksResponse>('/api/tasks');
}

export async function updateTaskStatus(taskId: string, input: TaskStatusUpdateInput): Promise<void> {
  await apiPatch<void>(`/api/tasks/${taskId}/status`, input);
}
