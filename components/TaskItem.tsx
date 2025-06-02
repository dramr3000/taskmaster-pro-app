
import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS, STATUS_TEXT_COLORS, STATUS_BORDER_COLORS } from '../constants';
import UsersIcon from './UsersIcon';
import ChatBubbleIcon from './ChatBubbleIcon'; // Import the new icon
import CheckCalendarIcon from './CheckCalendarIcon'; // Import the actual completion date icon

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.111 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);


const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const statusColor = STATUS_COLORS[task.status] || 'bg-gray-200';
  const statusTextColor = STATUS_TEXT_COLORS[task.status] || 'text-gray-700';
  const statusBorderColor = STATUS_BORDER_COLORS[task.status] || 'border-gray-300';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    // Ensuring date is parsed as local by adding time component if it's just YYYY-MM-DD
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00');
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const formattedStartDate = formatDate(task.startDate);
  const formattedDueDate = formatDate(task.dueDate);
  const formattedActualCompletionDate = formatDate(task.actualCompletionDate); // NEW

  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 border-l-4 ${statusBorderColor} transition-all hover:shadow-xl`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-semibold text-slate-800 flex-grow break-words pr-2">{task.title}</h3>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor} ${statusTextColor} self-start`}>
          {task.status}
        </div>
      </div>
      {task.description && (
         <p className="text-sm text-slate-600 mb-3 break-words whitespace-pre-wrap">{task.description.substring(0,150)}{task.description.length > 150 ? '...' : ''}</p>
      )}
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mb-3">
        {formattedStartDate && (
          <div className="flex items-center" aria-label="Start date">
            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400" />
            <span>Start: {formattedStartDate}</span>
          </div>
        )}
        {formattedDueDate && (
          <div className="flex items-center" aria-label="Due date">
            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-red-400" />
            <span>Due: {formattedDueDate}</span>
          </div>
        )}
        {formattedActualCompletionDate && ( // NEW
          <div className="flex items-center" aria-label="Actual completion date">
            <CheckCalendarIcon className="w-4 h-4 mr-1.5 text-green-500" />
            <span>Completed: {formattedActualCompletionDate}</span>
          </div>
        )}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center" aria-label="Assignees">
            <UsersIcon className="w-4 h-4 mr-1.5 text-slate-400" />
            <span>{task.assignees.join(', ')}</span>
          </div>
        )}
        {task.stakeholders && task.stakeholders.length > 0 && (
          <div className="flex items-center" aria-label="Stakeholders">
            <UsersIcon className="w-4 h-4 mr-1.5 text-slate-400" /> 
            <span>{task.stakeholders.join(', ')}</span>
          </div>
        )}
      </div>

      {task.comments && (
        <div className="mt-2 mb-3 p-2 bg-slate-50 rounded border border-slate-200" aria-label="Comments">
          <div className="flex items-start text-sm text-slate-700">
            <ChatBubbleIcon className="w-4 h-4 mr-2 mt-0.5 text-sky-500 flex-shrink-0" />
            <p className="whitespace-pre-wrap break-words flex-grow"><span className="font-medium">Notes:</span> {task.comments}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={onEdit}
          className="p-2 text-sky-600 hover:text-sky-800 transition-colors duration-150"
          aria-label="Edit task"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:text-red-700 transition-colors duration-150"
          aria-label="Delete task"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;