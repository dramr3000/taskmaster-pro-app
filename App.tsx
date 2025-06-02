
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from './types';
import { APP_NAME, TASK_STATUS_OPTIONS } from './constants';
import Header from './components/Header';
import TaskList from './components/TaskList';
import FAB from './components/FAB';
import TaskFormModal from './components/TaskFormModal';
import CalendarTimelineView from './components/CalendarTimelineView';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStartDateFrom, setFilterStartDateFrom] = useState<string>('');
  const [filterStartDateTo, setFilterStartDateTo] = useState<string>('');
  const [filterActualCompletionDateFrom, setFilterActualCompletionDateFrom] = useState<string>(''); // New state
  const [filterActualCompletionDateTo, setFilterActualCompletionDateTo] = useState<string>(''); // New state

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const migratedTasks = parsedTasks.map((task: any) => {
          if (task.assignee && typeof task.assignee === 'string' && !task.assignees) {
            return { ...task, assignees: [task.assignee], assignee: undefined };
          }
          return task;
        });
        setTasks(migratedTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoading]);

  const openModalForNewTask = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openModalForEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>, id?: string) => {
    setTasks(prevTasks => {
      if (id) {
        return prevTasks.map(task => 
          task.id === id ? { ...task, ...taskData, id: task.id, createdAt: task.createdAt } : task
        );
      } else {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(), 
          createdAt: new Date().toISOString(),
        };
        return [newTask, ...prevTasks];
      }
    });
    closeModal();
  }, [closeModal]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  }, []);
  
  const suggestDescription = useCallback(async (title: string): Promise<string> => {
    if (!title.trim()) return "Please provide a title first.";
    try {
      const description = await geminiService.generateTaskDescription(title);
      return description;
    } catch (error) {
      console.error("Error suggesting description:", error);
      return "Could not generate description. Please try again or write one manually.";
    }
  }, []);

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignees && task.assignees.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (task.stakeholders && task.stakeholders.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (task.startDate && task.startDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.dueDate && task.dueDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.actualCompletionDate && task.actualCompletionDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.comments && task.comments.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(task => filterStatus === 'ALL' || task.status === filterStatus)
    .filter(task => {
      if (!filterStartDateFrom && !filterStartDateTo) {
        return true;
      }
      if (!task.startDate) {
        return false; 
      }
      const taskStartDate = task.startDate;
      let matchesFrom = true;
      if (filterStartDateFrom) {
        matchesFrom = taskStartDate >= filterStartDateFrom;
      }
      let matchesTo = true;
      if (filterStartDateTo) {
        matchesTo = taskStartDate <= filterStartDateTo;
      }
      return matchesFrom && matchesTo;
    })
    .filter(task => { // New Actual Completion Date Range Filter
      if (!filterActualCompletionDateFrom && !filterActualCompletionDateTo) {
        return true; // No date range filter applied
      }
      if (!task.actualCompletionDate) {
        return false; 
      }
      const taskCompletionDate = task.actualCompletionDate;

      let matchesFrom = true;
      if (filterActualCompletionDateFrom) {
        matchesFrom = taskCompletionDate >= filterActualCompletionDateFrom;
      }

      let matchesTo = true;
      if (filterActualCompletionDateTo) {
        matchesTo = taskCompletionDate <= filterActualCompletionDateTo;
      }
      return matchesFrom && matchesTo;
    })
    .sort((a, b) => {
      const statusOrder = TASK_STATUS_OPTIONS;
      if (statusOrder.indexOf(a.status) !== statusOrder.indexOf(b.status)) {
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      }
      if(a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      if (a.status === TaskStatus.COMPLETED && b.status === TaskStatus.COMPLETED) {
        if (a.actualCompletionDate && b.actualCompletionDate) {
            return new Date(a.actualCompletionDate).getTime() - new Date(b.actualCompletionDate).getTime();
        } else if (a.actualCompletionDate) {
            return -1;
        } else if (b.actualCompletionDate) {
            return 1;
        }
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header 
        appName={APP_NAME} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterStartDateFrom={filterStartDateFrom}
        onFilterStartDateFromChange={setFilterStartDateFrom}
        filterStartDateTo={filterStartDateTo}
        onFilterStartDateToChange={setFilterStartDateTo}
        filterActualCompletionDateFrom={filterActualCompletionDateFrom} 
        onFilterActualCompletionDateFromChange={setFilterActualCompletionDateFrom} 
        filterActualCompletionDateTo={filterActualCompletionDateTo} 
        onFilterActualCompletionDateToChange={setFilterActualCompletionDateTo} 
      />
      <main className="flex-grow overflow-y-auto p-4 pt-[11rem] sm:pt-[9.5rem] md:pt-40 lg:pt-40">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-slate-600 text-lg">Loading tasks...</p>
          </div>
        ) : viewMode === 'list' ? (
          <TaskList 
            tasks={filteredTasks} 
            onEditTask={openModalForEditTask} 
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <CalendarTimelineView 
            tasks={filteredTasks}
            onEditTask={openModalForEditTask} 
          />
        )}
      </main>
      <FAB onOpenNewTaskModal={openModalForNewTask} />
      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          taskToEdit={editingTask}
          onSuggestDescription={suggestDescription}
        />
      )}
    </div>
  );
};

export default App;
