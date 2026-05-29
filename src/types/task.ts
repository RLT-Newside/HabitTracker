export type Priority = 0 | 1 | 2 | 3;

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
  completed: boolean;
  completedAt: string | null;
  priority: Priority;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
}
