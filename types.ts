
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignees?: string[];
  stakeholders?: string[];
  startDate?: string; // YYYY-MM-DD format
  dueDate?: string; // YYYY-MM-DD format
  actualCompletionDate?: string; // YYYY-MM-DD format - NEW
  comments?: string; // New field for comments/notes
  createdAt: string; // ISO string
}