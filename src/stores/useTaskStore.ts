import { create } from 'zustand';
import { Task, CreateTaskInput } from '../types/task';
import { taskRepository } from '../db/repositories/taskRepository';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  loadTasks: (includeCompleted?: boolean) => Promise<void>;
  loadTasksByDate: (date: string) => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<string>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  loadTasks: async (includeCompleted = false) => {
    set({ loading: true });
    const tasks = await taskRepository.getAll(includeCompleted);
    set({ tasks, loading: false });
  },

  loadTasksByDate: async (date) => {
    set({ loading: true });
    const tasks = await taskRepository.getByDate(date);
    set({ tasks, loading: false });
  },

  createTask: async (input) => {
    const id = await taskRepository.create(input);
    await get().loadTasks();
    return id;
  },

  toggleTask: async (taskId) => {
    await taskRepository.toggleComplete(taskId);
    await get().loadTasks(true);
  },

  deleteTask: async (taskId) => {
    await taskRepository.delete(taskId);
    await get().loadTasks();
  },
}));
