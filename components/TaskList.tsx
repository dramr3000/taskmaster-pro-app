
import React from 'react';
import type { Task } from '../types'; // Adjusted path assuming types.ts is at root
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-slate-500 mt-8">No tasks yet. Add one to get started!</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem 
          key={task._id}                       // MODIFIED: from task.id to task._id
          task={task} 
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task._id)} // MODIFIED: from task.id to task._id
        />
      ))}
    </div>
  );
};

export default TaskList;