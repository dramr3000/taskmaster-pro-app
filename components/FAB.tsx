
import React from 'react';

interface FABProps {
  onOpenNewTaskModal: () => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const FAB: React.FC<FABProps> = ({ onOpenNewTaskModal }) => {
  return (
    <button
      onClick={onOpenNewTaskModal}
      className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 z-40"
      aria-label="Add new task"
    >
      <PlusIcon className="w-7 h-7" />
    </button>
  );
};

export default FAB;