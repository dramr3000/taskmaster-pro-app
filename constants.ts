
import { TaskStatus } from './types';

export const APP_NAME = "TaskMaster Pro";

export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const STATUS_COLORS: { [key in TaskStatus]: string } = {
  [TaskStatus.TODO]: 'bg-yellow-400', // Changed from bg-gray-500
  [TaskStatus.IN_PROGRESS]: 'bg-orange-400', // Changed from bg-yellow-500
  [TaskStatus.COMPLETED]: 'bg-green-500', // Remains the same
};

export const STATUS_TEXT_COLORS: { [key in TaskStatus]: string } = {
  [TaskStatus.TODO]: 'text-yellow-800', // Changed from text-gray-800
  [TaskStatus.IN_PROGRESS]: 'text-orange-800', // Changed from text-yellow-800
  [TaskStatus.COMPLETED]: 'text-green-800', // Remains the same
};

export const STATUS_BORDER_COLORS: { [key in TaskStatus]: string } = {
  [TaskStatus.TODO]: 'border-yellow-400', // Changed from border-gray-500
  [TaskStatus.IN_PROGRESS]: 'border-orange-400', // Changed from border-yellow-500
  [TaskStatus.COMPLETED]: 'border-green-500', // Remains the same
};