"use client";
import React, { useState, useEffect } from 'react';

const LifeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    daysCompleted: 0,
    totalDays: 0,
    percentComplete: 0,
    daysLeft: 0
  });

  // iPhone green color (similar to iMessage green)
  const IPHONE_GREEN = '#34C759';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate year progress
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
    const totalDays = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    const daysPassed = Math.ceil((currentDate - startOfYear) / (1000 * 60 * 60 * 24));
    const daysLeft = totalDays - daysPassed;
    const percentComplete = ((daysPassed / totalDays) * 100).toFixed(1);

    setStats({
      daysCompleted: daysPassed,
      totalDays,
      percentComplete,
      daysLeft
    });
  }, [currentDate]);

 

  // Generate calendar dots (365 days)
  const generateCalendarDots = () => {
    const totalDays = stats.totalDays || 365;
    const completed = stats.daysCompleted;
    const columns = 25;
    
    // Calculate full rows and remaining dots
    const fullRows = Math.floor(totalDays / columns);
    const remainingDots = totalDays % columns;
    
    const allDots = [];
    
    // Generate full rows
    for (let row = 0; row < fullRows; row++) {
      const rowDots = [];
      for (let col = 0; col < columns; col++) {
        const i = row * columns + col;
        const isCompleted = i < completed;
        const isToday = i === completed - 1;
        
        rowDots.push(
          <div
            key={i}
            className={`dot ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
          />
        );
      }
      allDots.push(
        <div key={`row-${row}`} className="calendar-row">
          {rowDots}
        </div>
      );
    }
    
    // Generate last row if there are remaining dots
    if (remainingDots > 0) {
      const lastRowDots = [];
      for (let col = 0; col < remainingDots; col++) {
        const i = fullRows * columns + col;
        const isCompleted = i < completed;
        const isToday = i === completed - 1;
        
        lastRowDots.push(
          <div
            key={i}
            className={`dot ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
          />
        );
      }
      allDots.push(
        <div key="last-row" className="calendar-row last-row">
          {lastRowDots}
        </div>
      );
    }
    
    return allDots;
  };

  return (
    <div className="calendar-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          overflow: hidden;
        }

        .calendar-container {
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .date-header {
          text-align: center;
          margin-bottom: 30px;
          animation: fadeIn 0.6s ease-out;
        }

        .date-text {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .time-display {
          font-size: 88px;
          font-weight: 200;
          letter-spacing: -2px;
          line-height: 1;
          color: white;
          margin-bottom: 25px;
          font-feature-settings: 'tnum';
        }

        .progress-info {
          text-align: center;
          margin-bottom: 8px;
        }

        .percent-complete {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 6px;
        }

        .days-left {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
        }

        .calendar-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 520px;
          margin: 0 auto 40px;
          padding: 0 10px;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .calendar-row {
          display: flex;
          gap: 4px;
        }

        .calendar-row.last-row {
          justify-content: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .dot.completed {
          background: rgba(255, 255, 255, 1);
        }

        .dot.today {
          background: ${IPHONE_GREEN};
          {/* box-shadow: 
            0 0 12px ${IPHONE_GREEN},
            0 0 24px rgba(52, 199, 89, 0.4); */}
          {/* transform: scale(1.1); */}
          {/* animation: pulse 2s ease-in-out infinite; */}
        }

        {/* @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          } */}
        }

        .goals-section {
          text-align: center;
          margin-top: 30px;
          animation: fadeIn 1s ease-out 0.6s both;
        }

        .goals-title {
          font-size: 13px;
          font-weight: 700;
          text-align:center;
          color: ${IPHONE_GREEN};
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .goals-subtitle {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.5;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 768px) {
          .calendar-container {
            padding: 30px 15px;
          }

          .time-display {
            font-size: 72px;
          }

          .calendar-grid {
            gap: 3px;
            max-width: 400px;
          }

          .calendar-row {
            gap: 3px;
          }

          .dot {
            width: 6px;
            height: 6px;
          }
        }

        @media (max-width: 480px) {
          .time-display {
            font-size: 64px;
          }

          .calendar-grid {
            gap: 3px;
            max-width: 320px;
          }

          .calendar-row {
            gap: 3px;
          }

          .dot {
            width: 5px;
            height: 5px;
          }
        }

        /* iPhone specific optimizations */
        @media (max-width: 430px) {
          .calendar-container {
            padding: 40px 20px;
            justify-content: flex-start;
            padding-top: 80px;
          }

          .time-display {
            font-size: 80px;
          }

          .calendar-grid {
            gap: 2.5px;
            max-width: 100%;
            padding: 0 15px;
          }

          .calendar-row {
            gap: 2.5px;
          }

          .dot {
            width: 4px;
            height: 4px;
          }

          .dot.today {
            width: 5px;
            height: 5px;
          }
        }
      `}</style>

      <div className="date-header">
        <div className="progress-info">
          <div className="percent-complete">{stats.percentComplete}% complete</div>
          <div className="days-left">{stats.daysLeft} days left in {currentDate.getFullYear()}</div>
        </div>
      </div>

      <div className="calendar-grid">
        {generateCalendarDots()}
      </div>

      <div className="goals-section">
        <div className="goals-title">Today Goals</div>
        <div className="goals-subtitle">Learn something new that improves your life</div>
      </div>
    </div>
  );
};

export default LifeCalendar;