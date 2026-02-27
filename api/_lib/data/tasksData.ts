import type { ChecklistTasksResponse, ChecklistTask } from '../../../src/services/api/types';
import { supabaseSelect, supabaseUpsert } from './supabaseRest';

interface TaskCategoryRow {
  id: string;
  slug: string;
  name: string;
  display_order?: number | null;
}

interface TaskRow {
  id: string;
  category_id: string;
  title: string;
  description?: string | null;
  urgency?: 'normal' | 'urgent' | null;
  points?: number | null;
}

interface UserTaskStatusRow {
  task_id: string;
  status: 'todo' | 'in_progress' | 'done';
}

function fallbackChecklistTasks(): ChecklistTasksResponse {
  return {
    total: 3,
    completed: 1,
    categories: [
      { id: 'cat-admin', slug: 'admin', name: 'Admin' },
      { id: 'cat-finance', slug: 'finance', name: 'Finance' },
      { id: 'cat-essentials', slug: 'essentials', name: 'Essentials' },
    ],
    tasks: [
      {
        id: 'task-fallback-pesel',
        categoryId: 'cat-admin',
        title: 'Get PESEL number',
        description: 'Required for most official registrations and services.',
        urgency: 'urgent',
        points: 30,
        status: 'todo',
      },
      {
        id: 'task-fallback-bank',
        categoryId: 'cat-finance',
        title: 'Open Polish bank account',
        description: 'Needed for salary and local transfers.',
        urgency: 'normal',
        points: 20,
        status: 'done',
      },
      {
        id: 'task-fallback-sim',
        categoryId: 'cat-essentials',
        title: 'Get local SIM card',
        description: 'Use local mobile plans for calls and data.',
        urgency: 'normal',
        points: 10,
        status: 'todo',
      },
    ],
  };
}

export async function getChecklistTasksData(userId?: string | null): Promise<ChecklistTasksResponse> {
  const [categoryRows, taskRows, statusRows] = await Promise.all([
    supabaseSelect<TaskCategoryRow>('task_categories', 'id,slug,name,display_order', {
      limit: 200,
      orderBy: 'display_order',
      ascending: true,
    }),
    supabaseSelect<TaskRow>(
      'tasks',
      'id,category_id,title,description,urgency,points',
      {
        limit: 1000,
        orderBy: 'created_at',
        ascending: true,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    userId
      ? supabaseSelect<UserTaskStatusRow>('user_task_status', 'task_id,status', {
          limit: 1000,
          orderBy: 'updated_at',
          ascending: false,
          filters: [{ column: 'user_id', op: 'eq', value: userId }],
        })
      : Promise.resolve([]),
  ]);

  if (!taskRows.length || !categoryRows.length) {
    return fallbackChecklistTasks();
  }

  const statusByTaskId = new Map(statusRows.map((row) => [row.task_id, row.status]));

  const tasks: ChecklistTask[] = taskRows.map((task) => ({
    id: task.id,
    categoryId: task.category_id,
    title: task.title,
    description: task.description || '',
    urgency: task.urgency === 'urgent' ? 'urgent' : 'normal',
    points: Number(task.points || 0),
    status: statusByTaskId.get(task.id) || 'todo',
  }));

  const completed = tasks.filter((task) => task.status === 'done').length;

  return {
    total: tasks.length,
    completed,
    categories: categoryRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
    })),
    tasks,
  };
}

export async function setChecklistTaskStatus(
  taskId: string,
  userId: string,
  status: 'todo' | 'in_progress' | 'done',
): Promise<void> {
  await supabaseUpsert(
    'user_task_status',
    {
      task_id: taskId,
      user_id: userId,
      status,
      completed_at: status === 'done' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,task_id' },
  );
}
