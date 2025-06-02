
import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { STATUS_COLORS, STATUS_TEXT_COLORS, STATUS_BORDER_COLORS, TASK_STATUS_OPTIONS } from '../constants';

interface CalendarTimelineViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const formatDateHeader = (date: Date): string => {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const getISODateString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0]; // YYYY-MM-DD
};

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const CalendarTimelineView: React.FC<CalendarTimelineViewProps> = ({ tasks, onEditTask }) => {
  const [currentTimelineStartDate, setCurrentTimelineStartDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day
    return today;
  });

  const daysToShow = 7;

  const timelineDates = useMemo(() => {
    return Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(currentTimelineStartDate);
      date.setDate(currentTimelineStartDate.getDate() + i);
      return date;
    });
  }, [currentTimelineStartDate]);

  const tasksByDate = useMemo(() => {
    const groupedTasks: { [key: string]: Task[] } = {};
    timelineDates.forEach(date => {
      const displayDateStr = getISODateString(date);
      groupedTasks[displayDateStr] = [];
      const addedTaskIdsThisDay = new Set<string>();

      tasks.forEach(task => {
        // Check if task should appear on this day (either as start or due date)
        let shouldAddTask = false;
        if (task.startDate === displayDateStr) {
          shouldAddTask = true;
        }
        if (task.dueDate === displayDateStr) {
          shouldAddTask = true;
        }

        if (shouldAddTask && !addedTaskIdsThisDay.has(task.id)) {
          groupedTasks[displayDateStr].push(task);
          addedTaskIdsThisDay.add(task.id);
        }
      });
      
      // Sort tasks for this day
      groupedTasks[displayDateStr].sort((a, b) => {
        const statusOrder = TASK_STATUS_OPTIONS;
        if (statusOrder.indexOf(a.status) !== statusOrder.indexOf(b.status)) {
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        return a.title.localeCompare(b.title);
      });
    });
    return groupedTasks;
  }, [tasks, timelineDates]);

  const handlePreviousWeek = () => {
    const newStartDate = new Date(currentTimelineStartDate);
    newStartDate.setDate(currentTimelineStartDate.getDate() - daysToShow);
    setCurrentTimelineStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(currentTimelineStartDate);
    newStartDate.setDate(currentTimelineStartDate.getDate() + daysToShow);
    setCurrentTimelineStartDate(newStartDate);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value + 'T00:00:00'); // Ensure local timezone interpretation
    setCurrentTimelineStartDate(newDate);
  };
  
  const timelineEndDate = new Date(currentTimelineStartDate);
  timelineEndDate.setDate(currentTimelineStartDate.getDate() + daysToShow - 1);

  // Check if there are any tasks to display in the current 7-day window
  const hasTasksInView = useMemo(() => 
    Object.values(tasksByDate).some(dailyTasks => dailyTasks.length > 0),
  [tasksByDate]);


  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 p-3 bg-slate-100 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="Previous 7 days"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <input
            type="date"
            value={getISODateString(currentTimelineStartDate)}
            onChange={handleDateChange}
            className="px-3 py-1.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-700"
            aria-label="Select timeline start date"
          />
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="Next 7 days"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="text-sm text-slate-600 text-center sm:text-right">
          Showing: <span className="font-medium">{formatDateHeader(currentTimelineStartDate)}</span> - <span className="font-medium">{formatDateHeader(timelineEndDate)}</span>
        </div>
      </div>

      {!hasTasksInView && (
         <p className="text-center text-slate-500 mt-8">No tasks with start or due dates in this 7-day period.</p>
      )}

      {hasTasksInView && (
        <div className="overflow-x-auto pb-4 flex-grow" role="region" aria-label={`${daysToShow}-Day Task Calendar`}>
          <div className="flex space-x-3 min-w-max p-1">
            {timelineDates.map(date => {
              const dateStr = getISODateString(date);
              const dailyTasks = tasksByDate[dateStr] || [];
              const isToday = getISODateString(new Date()) === dateStr;

              return (
                <div 
                  key={dateStr} 
                  className={`flex-none w-60 sm:w-64 md:w-72 bg-slate-50 rounded-lg shadow p-3 ${isToday ? 'border-2 border-sky-500 ring-1 ring-sky-500' : 'border border-slate-200'}`}
                  aria-labelledby={`date-header-${dateStr}`}
                >
                  <h3 
                    id={`date-header-${dateStr}`}
                    className={`text-sm sm:text-md font-semibold mb-3 text-center ${isToday ? 'text-sky-600' : 'text-slate-700'}`}
                  >
                    {formatDateHeader(date)}
                  </h3>
                  {dailyTasks.length > 0 ? (
                    <ul className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto"> {/* Adjusted max-height */}
                      {dailyTasks.map(task => (
                        <li 
                          key={task.id + '-' + dateStr} // Ensure unique key if task appears on multiple days
                          onClick={() => onEditTask(task)}
                          className={`p-2.5 rounded shadow-sm cursor-pointer hover:shadow-md transition-all duration-150 ease-in-out bg-white border-l-4 ${STATUS_BORDER_COLORS[task.status]} focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEditTask(task);}}
                          aria-label={`Edit task: ${task.title}, Status: ${task.status}${task.startDate === dateStr ? `, Starts: ${formatDateHeader(date)}` : ''}${task.dueDate === dateStr ? `, Due: ${formatDateHeader(date)}` : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-800 text-xs sm:text-sm break-words pr-1 flex-grow">{task.title}</span>
                          </div>
                           { (task.startDate === dateStr && task.dueDate === dateStr) ? (
                             <span className="text-[10px] text-blue-600 block mt-0.5">Starts & Due</span>
                           ) : task.startDate === dateStr ? (
                             <span className="text-[10px] text-green-600 block mt-0.5">Starts Today</span>
                           ) : task.dueDate === dateStr ? (
                             <span className="text-[10px] text-red-600 block mt-0.5">Due Today</span>
                           ): null }
                          <div className={`mt-1 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full inline-block ${STATUS_COLORS[task.status]} ${STATUS_TEXT_COLORS[task.status]}`}>
                              {task.status}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 text-center pt-2 h-full flex items-center justify-center">No tasks for this day.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTimelineView;