import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getTasks, updateTaskStatus } from '../repositories/tasksRepository';
import type { ChecklistTasksResponse, TaskStatusUpdateInput } from '../types';

interface UseChecklistTasksOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseChecklistTasksResult {
  data: ChecklistTasksResponse | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  updateStatus: (taskId: string, status: TaskStatusUpdateInput['status']) => Promise<void>;
}

export function useChecklistTasks(options: UseChecklistTasksOptions = {}): UseChecklistTasksResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<ChecklistTasksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchTasks = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getTasks();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load checklist tasks'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchTasks();
    const interval = window.setInterval(fetchTasks, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  const updateStatus = async (taskId: string, status: TaskStatusUpdateInput['status']) => {
    if (!shouldFetch) return;
    await updateTaskStatus(taskId, { status });
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      updateStatus,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
