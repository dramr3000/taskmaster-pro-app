
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { TASK_STATUS_OPTIONS } from '../constants';
import Spinner from './Spinner';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => void;
  taskToEdit: Task | null;
  onSuggestDescription: (title: string) => Promise<string>;
}

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.39m3.421 3.42a15.995 15.995 0 0 0 1.622-3.39m3.79 3.79a15.995 15.995 0 0 0 3.388-1.62m0-3.742a3.003 3.003 0 0 0-4.175-4.175l-.955.955a3.003 3.003 0 1 0 4.175 4.175L19.5 8.55Z" />
  </svg>
);

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset * 60 * 1000));
  return adjustedToday.toISOString().split('T')[0];
};


const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, taskToEdit, onSuggestDescription }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [assigneesInput, setAssigneesInput] = useState('');
  const [stakeholdersInput, setStakeholdersInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [actualCompletionDate, setActualCompletionDate] = useState(''); // NEW
  const [comments, setComments] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setAssigneesInput('');
    setStakeholdersInput('');
    setStartDate('');
    setDueDate('');
    setActualCompletionDate(''); // NEW
    setComments('');
    setSuggestionError(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setStatus(taskToEdit.status);
            setAssigneesInput(taskToEdit.assignees?.join(', ') || '');
            setStakeholdersInput(taskToEdit.stakeholders?.join(', ') || '');
            setStartDate(taskToEdit.startDate || '');
            setDueDate(taskToEdit.dueDate || '');
            setActualCompletionDate(taskToEdit.actualCompletionDate || ''); // NEW
            setComments(taskToEdit.comments || '');
        } else {
            resetForm();
        }
        setSuggestionError(null); // Clear suggestion error when modal opens or task changes
    }
  }, [isOpen, taskToEdit, resetForm]);

  // Effect to manage actualCompletionDate based on status
  useEffect(() => {
    if (status === TaskStatus.COMPLETED) {
      if (!actualCompletionDate) { // Only set if not already set (e.g., when editing a completed task)
        setActualCompletionDate(getTodayDateString());
      }
    } else {
      // If status is not 'Completed', clear actualCompletionDate
      setActualCompletionDate('');
    }
  }, [status]); // Rerun when status changes


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    if (startDate && dueDate && startDate > dueDate) {
      alert("Start date cannot be after due date.");
      return;
    }
    // Ensure actualCompletionDate is only saved if status is Completed
    const finalActualCompletionDate = status === TaskStatus.COMPLETED ? actualCompletionDate : undefined;

    const assigneesArray = assigneesInput.split(',').map(a => a.trim()).filter(a => a);
    const stakeholdersArray = stakeholdersInput.split(',').map(s => s.trim()).filter(s => s);
    
onSave({
  title: title.trim(),
  description: description.trim() || undefined, // Ensure undefined if empty
  status,
  assignees: assigneesArray.length > 0 ? assigneesArray : undefined,
  stakeholders: stakeholdersArray.length > 0 ? stakeholdersArray : undefined,
  startDate: startDate || undefined,
  dueDate: dueDate, // dueDate is required, ensure form validates this
  actualCompletionDate: finalActualCompletionDate,
  comments: comments.trim() || undefined,
  // DO NOT include _id, createdAt, or updatedAt here
});
  };

  const handleSuggestDescription = useCallback(async () => {
    if (!title.trim()) {
      setSuggestionError("Please enter a task title first to generate a description.");
      return;
    }
    setIsSuggesting(true);
    setSuggestionError(null);
    try {
      const suggestedDesc = await onSuggestDescription(title);
      setDescription(suggestedDesc);
      if (suggestedDesc.startsWith("Could not generate") || suggestedDesc.startsWith("Please provide") || suggestedDesc.startsWith("API Key") || suggestedDesc.startsWith("Error:")) {
          setSuggestionError(suggestedDesc);
      }
    } catch (error) {
      console.error("Modal suggestion error:", error);
      setSuggestionError("Failed to suggest description. Check console for details.");
    } finally {
      setIsSuggesting(false);
    }
  }, [title, onSuggestDescription]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <button 
                type="button"
                onClick={handleSuggestDescription}
                disabled={isSuggesting || !title.trim()}
                className="text-xs text-sky-600 hover:text-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center"
              >
                {isSuggesting ? <Spinner size="xs" /> : <MagicWandIcon className="w-4 h-4 mr-1" />}
                Suggest
              </button>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
            {suggestionError && <p className="text-xs text-red-500 mt-1">{suggestionError}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              {TASK_STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="actualCompletionDate" className="block text-sm font-medium text-slate-700">Actual Completion Date</label>
            <input
              type="date"
              id="actualCompletionDate"
              value={actualCompletionDate}
              onChange={(e) => setActualCompletionDate(e.target.value)}
              disabled={status !== TaskStatus.COMPLETED} // NEW: Disable if status is not 'Completed'
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="assignees" className="block text-sm font-medium text-slate-700">Assignees (comma-separated)</label>
            <input
              type="text"
              id="assignees"
              value={assigneesInput}
              onChange={(e) => setAssigneesInput(e.target.value)}
              placeholder="e.g., John Doe, Jane Smith"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="stakeholders" className="block text-sm font-medium text-slate-700">Stakeholders (comma-separated)</label>
            <input
              type="text"
              id="stakeholders"
              value={stakeholdersInput}
              onChange={(e) => setStakeholdersInput(e.target.value)}
              placeholder="e.g., Project Lead, Client"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-slate-700">Comments / Notes</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2} 
              placeholder="Add any relevant notes or comments..."
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;