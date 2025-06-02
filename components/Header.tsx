
import React from 'react';
import { TaskStatus } from '../types';
import { TASK_STATUS_OPTIONS } from '../constants';

interface HeaderProps {
  appName: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: TaskStatus | 'ALL';
  onFilterChange: (status: TaskStatus | 'ALL') => void;
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  filterStartDateFrom: string;
  onFilterStartDateFromChange: (date: string) => void;
  filterStartDateTo: string;
  onFilterStartDateToChange: (date: string) => void;
  filterActualCompletionDateFrom: string;
  onFilterActualCompletionDateFromChange: (date: string) => void;
  filterActualCompletionDateTo: string;
  onFilterActualCompletionDateToChange: (date: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  appName, 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange,
  viewMode,
  onViewModeChange,
  filterStartDateFrom,
  onFilterStartDateFromChange,
  filterStartDateTo,
  onFilterStartDateToChange,
  filterActualCompletionDateFrom,
  onFilterActualCompletionDateFromChange,
  filterActualCompletionDateTo,
  onFilterActualCompletionDateToChange,
}) => {
  return (
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex flex-col space-y-2 sm:space-y-3">
        {/* Row 1: Title and Primary Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-0 self-start md:self-center">{appName}</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 w-full sm:w-auto"
              aria-label="Search tasks"
            />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as TaskStatus | 'ALL')}
              className="px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 w-full sm:w-auto"
              aria-label="Filter tasks by status"
            >
              <option value="ALL">All Statuses</option>
              {TASK_STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className="flex items-center space-x-1 sm:ml-1 w-full sm:w-auto">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium w-1/2 sm:w-auto ${viewMode === 'list' ? 'bg-white text-sky-600 shadow-inner' : 'text-sky-100 hover:bg-sky-500 hover:text-white'}`}
                aria-pressed={viewMode === 'list'}
              >
                List
              </button>
              <button
                onClick={() => onViewModeChange('calendar')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium w-1/2 sm:w-auto ${viewMode === 'calendar' ? 'bg-white text-sky-600 shadow-inner' : 'text-sky-100 hover:bg-sky-500 hover:text-white'}`}
                aria-pressed={viewMode === 'calendar'}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Combined Date Filters Row (Conditional for List View) */}
        {viewMode === 'list' && (
          <div className="flex flex-col md:flex-row md:justify-end md:items-start gap-x-4 gap-y-3 pt-1">
            
            {/* Start Date Filters Group */}
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label htmlFor="filterStartDateFrom" className="text-xs text-sky-100 mb-0.5 ml-1">Start Date From:</label>
                <input
                  type="date"
                  id="filterStartDateFrom"
                  value={filterStartDateFrom || ''}
                  onChange={(e) => onFilterStartDateFromChange(e.target.value)}
                  max={filterStartDateTo || undefined}
                  className="px-3 py-1.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 text-sm w-full sm:w-auto"
                  aria-label="Filter tasks by start date from"
                />
              </div>
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label htmlFor="filterStartDateTo" className="text-xs text-sky-100 mb-0.5 ml-1">Start Date To:</label>
                <input
                  type="date"
                  id="filterStartDateTo"
                  value={filterStartDateTo || ''}
                  onChange={(e) => onFilterStartDateToChange(e.target.value)}
                  min={filterStartDateFrom || undefined}
                  className="px-3 py-1.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 text-sm w-full sm:w-auto"
                  aria-label="Filter tasks by start date to"
                />
              </div>
            </div>

            {/* Completion Date Filters Group */}
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label htmlFor="filterActualCompletionDateFrom" className="text-xs text-sky-100 mb-0.5 ml-1">Completion Date From:</label>
                <input
                  type="date"
                  id="filterActualCompletionDateFrom"
                  value={filterActualCompletionDateFrom || ''}
                  onChange={(e) => onFilterActualCompletionDateFromChange(e.target.value)}
                  max={filterActualCompletionDateTo || undefined}
                  className="px-3 py-1.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 text-sm w-full sm:w-auto"
                  aria-label="Filter tasks by actual completion date from"
                />
              </div>
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label htmlFor="filterActualCompletionDateTo" className="text-xs text-sky-100 mb-0.5 ml-1">Completion Date To:</label>
                <input
                  type="date"
                  id="filterActualCompletionDateTo"
                  value={filterActualCompletionDateTo || ''}
                  onChange={(e) => onFilterActualCompletionDateToChange(e.target.value)}
                  min={filterActualCompletionDateFrom || undefined}
                  className="px-3 py-1.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 text-slate-800 text-sm w-full sm:w-auto"
                  aria-label="Filter tasks by actual completion date to"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
