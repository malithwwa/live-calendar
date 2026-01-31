import React, { useState } from 'react';
import './index.css';

const LifeCalendar = () => {
  const [goal] = useState('Stay Consistent');
  const [startDate] = useState('2026-01-01');
  const [goalDate] = useState('2026-12-31');
  const [checkedDays, setCheckedDays] = useState(new Set());
  
  // Calculate total days between start and goal date
  const getTotalDays = () => {
    const start = new Date(startDate);
    const end = new Date(goalDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
    return diffDays;
  };
  
  const totalDays = getTotalDays();
  
  // Helper function to determine if a day index is today
  const isTodayIndex = (dayIndex) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayDate = getDateForDay(dayIndex);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate.getTime() === today.getTime();
  };
  
  // Helper function to determine if a day is in the past
  const isPastDay = (dayIndex) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayDate = getDateForDay(dayIndex);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate < today;
  };
  
  // Calculate days per row for optimal layout
  const getDaysPerRow = () => {
    // Aim for roughly square grid, with slight preference for wider layout
    return Math.ceil(Math.sqrt(totalDays * 1.5));
  };
  
  const daysPerRow = getDaysPerRow();
  
  // Get date for a specific day index
  const getDateForDay = (dayIndex) => {
    const start = new Date(startDate);
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    return date;
  };
  
  // Toggle day completion
  const toggleDay = (dayIndex) => {
    const newChecked = new Set(checkedDays);
    if (newChecked.has(dayIndex)) {
      newChecked.delete(dayIndex);
    } else {
      newChecked.add(dayIndex);
    }
    setCheckedDays(newChecked);
  };
  
  // Format date nicely
  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Calculate progress based on days passed
  const getDaysCompleted = () => {
    let count = 0;
    for (let i = 0; i < totalDays; i++) {
      if (isPastDay(i)) {
        count++;
      }
    }
    return count;
  };
  
  const daysCompleted = getDaysCompleted();
  const progress = ((daysCompleted / totalDays) * 100).toFixed(1);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {goal}
          </h1>
          <p className="text-lg text-gray-300 mb-2">
            {formatDate(new Date(startDate))} - {formatDate(new Date(goalDate))}
          </p>
          <p className="text-xl font-semibold text-gray-200">
            {totalDays} days to achieve your goal
          </p>
          <p className="text-sm text-green-400 mt-2 font-medium">
            Auto-updating based on current date: {formatDate(new Date())}  
          </p>
        </div>
        
        {/* Progress Stats */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{daysCompleted}</p>
              <p className="text-gray-400">Days Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{totalDays - daysCompleted}</p>
              <p className="text-gray-400">Days Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{progress}%</p>
              <p className="text-gray-400">Progress</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-300 shadow-lg shadow-green-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div 
            className="grid gap-2 sm:gap-3 justify-center"
            style={{
              gridTemplateColumns: `repeat(${Math.min(daysPerRow, 40)}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: totalDays }, (_, index) => {
              const isChecked = checkedDays.has(index);
              const date = getDateForDay(index);
              const isToday = isTodayIndex(index);
              const isPast = isPastDay(index);
              
              // Determine dot status: past = white, today = blinking green, future = gray
              let dotClass = '';
              let statusText = '';
              
              if (isToday) {
                dotClass = 'bg-green-500 shadow-green-500/50 animate-pulse';
                statusText = 'Today';
              } else if (isPast) {
                dotClass = 'bg-white';
                statusText = 'Completed';
              } else {
                dotClass = 'bg-gray-700 border border-gray-600';
                statusText = 'Upcoming';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  className={`
                    aspect-square rounded-full
                    ${dotClass}
                  `}
                  title={`${formatDate(date)} - ${statusText}`}
                  style={{
                    width: '100%',
                    minWidth: '8px',
                    maxWidth: '32px',
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">
            <span className="inline-block w-3 h-3 bg-white rounded-full mr-2 align-middle"></span>
            Past days • 
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mx-2 align-middle animate-pulse"></span>
            Today • 
            <span className="inline-block w-3 h-3 bg-gray-700 border border-gray-600 rounded-full ml-2 align-middle"></span>
            Future days
          </p>
          <p className="text-xs mt-3 text-gray-500">
            Each dot represents one day of your journey from Jan 1 - Dec 31, 2026
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            gap: 0.375rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LifeCalendar;