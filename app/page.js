"use client";
import React, { useState, useEffect } from "react";
import { QUOTES } from "./data/quotes";

const LifeCalendar = () => {
  // Get current date in Sri Lankan timezone
  const getSriLankanDate = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
  };

  const [currentDate, setCurrentDate] = useState(getSriLankanDate());
  const [quote, setQuote] = useState("");
  const [stats, setStats] = useState({
    daysCompleted: 0,
    totalDays: 0,
    percentComplete: 0,
    daysLeft: 0,
  });

  const IPHONE_GREEN = "#34C759";

  // Initialize quote on mount (fresh on every refresh)
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  // Update current date every second using Sri Lankan timezone
  useEffect(() => {
    let lastDay = getSriLankanDate().getDate();

    const timer = setInterval(() => {
      const slDate = getSriLankanDate();
      setCurrentDate(slDate);

      // Check if day changed (crossed midnight in Sri Lanka)
      if (slDate.getDate() !== lastDay) {
        lastDay = slDate.getDate();
        console.log('New day detected in Sri Lanka - updating calendar');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // Calculate stats based on Sri Lankan date
  useEffect(() => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0);
    
    // Reset current date to start of today for accurate day counting
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0
    );

    const totalDays = 365 + (isLeapYear(currentDate.getFullYear()) ? 1 : 0);
    const daysPassed = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    const daysLeft = totalDays - daysPassed;
    const percentComplete = ((daysPassed / totalDays) * 100).toFixed(1);

    setStats({
      daysCompleted: daysPassed,
      totalDays,
      percentComplete,
      daysLeft,
    });

    // Log for debugging in Puppeteer screenshot
    console.log(`SL Date: ${currentDate.toDateString()}, Day ${daysPassed}/${totalDays}, ${percentComplete}% complete`);
  }, [currentDate]);

  const generateCalendarDots = () => {
    const totalDays = stats.totalDays || 365;
    const completed = stats.daysCompleted;
    const columns = 17;
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
          />
        );
      }
      allDots.push(
        <div key={`row-${row}`} className="calendar-row">
          {rowDots}
        </div>
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
          padding: 0 24px;
          margin-bottom: 28px;
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
          width: 12px;
          height: 12px;
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
          padding: 0 20px;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .dot {
            width: 10px;
            height: 10px;
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
          .dot {
            width: 11px;
            height: 11px;
          }

          .calendar-grid {
            gap: 4px;
            padding: 0 20px;
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
          .dot {
            width: 9px;
            height: 9px;
          }

          .dot.today {
            width: 9px;
            height: 9px;
          }

          .calendar-grid {
            gap: 8px;
            padding: 0 18px;
          }

          .calendar-row {
            gap: 8px;
          }

          .progress-info {
            margin-bottom: 20px;
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
            padding: 0 10px;
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
          {quote || "Preparing the Goal..."}
        </div>
      </div>
    </div>
  );
};

export default LifeCalendar;