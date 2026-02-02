"use client";
import React, { useState, useEffect } from "react";

const LifeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    daysCompleted: 0,
    totalDays: 0,
    percentComplete: 0,
    daysLeft: 0,
  });

  const IPHONE_GREEN = "#34C759";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  useEffect(() => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);

    // Reset current date to start of today for accurate day counting
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
    );

    const totalDays = 365 + (isLeapYear(currentDate.getFullYear()) ? 1 : 0);
    const daysPassed =
      Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is Jan 1
    const daysLeft = totalDays - daysPassed;
    const percentComplete = ((daysPassed / totalDays) * 100).toFixed(1);

    setStats({
      daysCompleted: daysPassed,
      totalDays,
      percentComplete,
      daysLeft,
    });
  }, [currentDate]);

  const generateCalendarDots = () => {
    const totalDays = stats.totalDays || 365;
    const completed = stats.daysCompleted;
    const columns = 25;
    const fullRows = Math.floor(totalDays / columns);
    const remainingDots = totalDays % columns;
    const allDots = [];

    for (let row = 0; row < fullRows; row++) {
      const rowDots = [];
      for (let col = 0; col < columns; col++) {
        const i = row * columns + col;
        const isCompleted = i < completed;
        const isToday = i === completed - 1;
        rowDots.push(
          <div
            key={i}
            className={`dot ${isCompleted ? "completed" : ""} ${isToday ? "today" : ""}`}
          />,
        );
      }
      allDots.push(
        <div key={`row-${row}`} className="calendar-row">
          {rowDots}
        </div>,
      );
    }

    if (remainingDots > 0) {
      const lastRowDots = [];
      for (let col = 0; col < remainingDots; col++) {
        const i = fullRows * columns + col;
        const isCompleted = i < completed;
        const isToday = i === completed - 1;
        lastRowDots.push(
          <div
            key={i}
            className={`dot ${isCompleted ? "completed" : ""} ${isToday ? "today" : ""}`}
          />,
        );
      }
      allDots.push(
        <div key="last-row" className="calendar-row last-row">
          {lastRowDots}
        </div>,
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

        html, body {
          height: 100%;
          background: #000;
          overflow: hidden;
        }

        .calendar-container {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: #000;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 60px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
          color: white;
          overflow: hidden;
        }

        /* Progress info */
        .progress-info {
          text-align: center;
          margin-bottom: 14px;
        }

        .percent-complete {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2px;
        }

        .days-left {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Calendar grid */
        .calendar-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          width: 100%;
          padding: 0 8px;
          margin-bottom: 16px;
        }

        .calendar-row {
          display: flex;
          gap: 5px;
          justify-content: center;
        }

        .calendar-row.last-row {
          justify-content: center;
        }

        /* Dots */
        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .dot.completed {
          background: rgba(255, 255, 255, 1);
        }

        .dot.today {
          background: ${IPHONE_GREEN};
        }

        /* Goals section */
        .goals-section {
          text-align: center;
        }

        .goals-title {
          font-size: 13px;
          font-weight: 700;
          color: ${IPHONE_GREEN};
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .goals-subtitle {
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.5;
          padding: 0 8px;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .calendar-container {
            padding-bottom: 55px;
          }

          .dot {
            width: 8px;
            height: 8px;
          }

          .calendar-grid {
            gap: 4px;
          }

          .calendar-row {
            gap: 4px;
          }
        }

        /* Large phones */
        @media (max-width: 480px) {
          .calendar-container {
            padding-bottom: 50px;
          }

          .dot {
            width: 7px;
            height: 7px;
          }

          .calendar-grid {
            gap: 4px;
            padding: 0 8px;
          }

          .calendar-row {
            gap: 4px;
          }

          .percent-complete {
            font-size: 15px;
          }

          .days-left {
            font-size: 13px;
          }
        }

        /* iPhone 14 Pro Max (430px) */
        @media (max-width: 430px) {
          .calendar-container {
            padding-bottom: calc(env(safe-area-inset-bottom, 34px) + 30px);
          }

          .dot {
            width: 6px;
            height: 6px;
          }

          .dot.today {
            width: 7px;
            height: 7px;
          }

          .calendar-grid {
            gap: 3.5px;
            padding: 0 6px;
          }

          .calendar-row {
            gap: 3.5px;
          }

          .progress-info {
            margin-bottom: 12px;
          }

          .goals-section {
            margin-top: 2px;
          }

          .goals-title {
            font-size: 12px;
            letter-spacing: 1.2px;
          }

          .goals-subtitle {
            font-size: 13px;
            padding: 0;
          }
        }

        /* iPhone SE / smaller (375px and below) */
        @media (max-width: 375px) {
          .calendar-container {
            padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 24px);
          }

          .dot {
            width: 5.5px;
            height: 5.5px;
          }

          .dot.today {
            width: 6.5px;
            height: 6.5px;
          }

          .calendar-grid {
            gap: 3px;
            padding: 0 14px;
          }

          .calendar-row {
            gap: 3px;
          }

          .progress-info {
            margin-bottom: 10px;
          }

          .percent-complete {
            font-size: 14px;
          }

          .days-left {
            font-size: 12px;
          }

          .goals-title {
            font-size: 11px;
          }

          .goals-subtitle {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="progress-info">
        <div className="percent-complete">
          {stats.percentComplete}% complete
        </div>
        <div className="days-left">
          {stats.daysLeft} days left in {currentDate.getFullYear()}
        </div>
      </div>

      <div className="calendar-grid">{generateCalendarDots()}</div>

      <div className="goals-section">
        <div className="goals-title">Today Goals</div>
        <div className="goals-subtitle">
          Learn something new that improves your life
        </div>
      </div>
    </div>
  );
};

export default LifeCalendar;
