/**
 * Parse natural language date/time phrases into Date objects
 */

export function parseDateFromText(text: string): Date | undefined {
  const lowerText = text.toLowerCase();
  const now = new Date();

  // Tomorrow
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return extractTime(lowerText, tomorrow);
  }

  // Today
  if (lowerText.includes('today')) {
    return extractTime(lowerText, new Date(now));
  }

  // Days of week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < days.length; i++) {
    if (lowerText.includes(days[i])) {
      const targetDay = i;
      const currentDay = now.getDay();
      let daysUntil = targetDay - currentDay;
      if (daysUntil <= 0) daysUntil += 7; // Next occurrence
      
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysUntil);
      return extractTime(lowerText, targetDate);
    }
  }

  // Next week
  if (lowerText.includes('next week')) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return extractTime(lowerText, nextWeek);
  }

  // This week
  if (lowerText.includes('this week')) {
    const thisWeek = new Date(now);
    thisWeek.setDate(thisWeek.getDate() + 3); // Default to 3 days from now
    return extractTime(lowerText, thisWeek);
  }

  // Next month
  if (lowerText.includes('next month')) {
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  }

  return undefined;
}

/**
 * Extract time from text and apply to date
 */
function extractTime(text: string, date: Date): Date {
  // Match patterns like "at 3pm", "at 3:30pm", "at 15:00"
  const timePatterns = [
    /at (\d{1,2}):(\d{2})\s*(am|pm)?/i,
    /at (\d{1,2})\s*(am|pm)/i,
    /(\d{1,2}):(\d{2})/,
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const meridiem = match[3]?.toLowerCase();

      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;

      date.setHours(hours, minutes, 0, 0);
      return date;
    }
  }

  // Default to 9am if no time specified
  date.setHours(9, 0, 0, 0);
  return date;
}

/**
 * Format date for display in Palm OS style
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if today
  if (date.toDateString() === now.toDateString()) {
    return 'TODAY';
  }

  // Check if tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'TOMORROW';
  }

  // Format as MM/DD
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}
