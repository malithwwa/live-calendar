// api/generate-wallpaper.js
// This is a Vercel serverless function that works with React apps
// Place this file in the /api folder at the root of your project

export default async function handler(req, res) {
  try {
    const { 
      goal = 'Stay Consistent', 
      width = 1290, 
      height = 2796 
    } = req.query;
    
    const startDate = new Date('2026-01-01');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalDays = 365;
    const daysPerRow = Math.ceil(Math.sqrt(totalDays * 1.5));
    
    // Calculate progress
    let daysCompleted = 0;
    for (let i = 0; i < totalDays; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      if (dayDate < today) daysCompleted++;
    }
    
    const progress = ((daysCompleted / totalDays) * 100).toFixed(1);
    
    // Generate dots HTML
    let dotsHTML = '';
    const dotSize = Math.min(
      (parseInt(width) - 160) / daysPerRow - 8,
      24
    );
    
    for (let i = 0; i < totalDays; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      
      const isToday = dayDate.getTime() === today.getTime();
      const isPast = dayDate < today;
      
      let className = 'dot';
      if (isToday) className += ' today';
      else if (isPast) className += ' past';
      else className += ' future';
      
      dotsHTML += `<div class="${className}"></div>`;
    }
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${width}, height=${height}">
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    body {
      width: ${width}px;
      height: ${height}px;
      background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 40px;
      overflow: hidden;
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
    }
    
    h1 { 
      font-size: ${Math.min(72, parseInt(width) / 15)}px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    
    .subtitle { 
      color: #d1d5db; 
      font-size: ${Math.min(28, parseInt(width) / 40)}px;
      margin-bottom: 8px;
      font-weight: 400;
    }
    
    .date-info { 
      color: #34d399; 
      font-size: ${Math.min(22, parseInt(width) / 50)}px;
      margin-top: 15px;
      font-weight: 500;
    }
    
    .stats {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(55, 65, 81, 0.8);
      border-radius: 24px;
      padding: 40px;
      width: calc(100% - 80px);
      max-width: ${parseInt(width) - 120}px;
      margin-bottom: 50px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    
    .stats-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 35px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      font-size: ${Math.min(52, parseInt(width) / 22)}px;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1;
    }
    
    .stat-label {
      color: #9ca3af;
      font-size: ${Math.min(18, parseInt(width) / 60)}px;
      font-weight: 400;
    }
    
    .progress-bar {
      width: 100%;
      height: 18px;
      background: #374151;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      width: ${progress}%;
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
      border-radius: 10px;
    }
    
    .calendar {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(55, 65, 81, 0.8);
      border-radius: 24px;
      padding: 45px;
      width: calc(100% - 80px);
      max-width: ${parseInt(width) - 120}px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    
    .dots {
      display: grid;
      grid-template-columns: repeat(${daysPerRow}, 1fr);
      gap: ${Math.max(6, parseInt(width) / 180)}px;
      justify-items: center;
      align-items: center;
    }
    
    .dot {
      width: ${dotSize}px;
      height: ${dotSize}px;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    
    .dot.past {
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.25);
    }
    
    .dot.today {
      background: #10b981;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.9), 
                  0 0 40px rgba(16, 185, 129, 0.5);
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .dot.future {
      background: #374151;
      border: 1px solid #4b5563;
    }
    
    @keyframes pulse {
      0%, 100% { 
        opacity: 1;
        transform: scale(1);
      }
      50% { 
        opacity: 0.75;
        transform: scale(1.1);
      }
    }
    
    .legend {
      margin-top: 50px;
      display: flex;
      justify-content: center;
      gap: 70px;
      color: #9ca3af;
      font-size: ${Math.min(20, parseInt(width) / 55)}px;
      font-weight: 400;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .legend-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${goal}</h1>
    <div class="subtitle">Jan 1, 2026 - Dec 31, 2026</div>
    <div class="subtitle">365 days to achieve your goal</div>
    <div class="date-info">Updated: ${today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}</div>
  </div>
  
  <div class="stats">
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-value">${daysCompleted}</div>
        <div class="stat-label">Days Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${totalDays - daysCompleted}</div>
        <div class="stat-label">Days Remaining</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" style="color: #34d399">${progress}%</div>
        <div class="stat-label">Progress</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
  </div>
  
  <div class="calendar">
    <div class="dots">${dotsHTML}</div>
  </div>
  
  <div class="legend">
    <div class="legend-item">
      <div class="legend-dot" style="background: white; box-shadow: 0 2px 8px rgba(255, 255, 255, 0.25);"></div>
      <span>Past</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);"></div>
      <span>Today</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #374151; border: 1px solid #4b5563;"></div>
      <span>Future</span>
    </div>
  </div>
</body>
</html>`;

    // Return HTML with proper headers for screenshot services
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating wallpaper:', error);
    res.status(500).json({ 
      error: 'Failed to generate wallpaper',
      message: error.message 
    });
  }
}