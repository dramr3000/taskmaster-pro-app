import React from 'react';

const CheckCalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 12.75h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM9.75 12.75h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008ZM7.5 12.75h.008v.008H7.5v-.008ZM16.5 10.5l-3.75 3.75-1.5-1.5" />
  </svg>
);

export default CheckCalendarIcon;