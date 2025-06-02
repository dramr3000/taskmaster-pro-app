
import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198-.001-.001M18 18.72a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1-4.682-2.72m.94 3.198-.001-.001M18 18.72L12.75 21M12.75 21L7.5 18.72m0 0a9.094 9.094 0 0 1 3.741.479 3 3 0 0 0 4.682 2.72M7.5 18.72a9.094 9.094 0 0 0-3.741.479 3 3 0 0 0 4.682 2.72m-.94-3.198-.001-.001M7.5 18.72L12.75 21m-2.625-8.625a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM12.75 6a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm4.875 8.625a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
  </svg>
);

export default UsersIcon;
