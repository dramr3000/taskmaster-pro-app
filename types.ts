
export const enum TaskStatus { //
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignees?: string[];
  stakeholders?: string[];
  dueDate?: string;
  actualCompletionDate?: string;
  comments?: string;
  startDate?: string;
  createdAt?: string;
  updatedAt?: string;
}