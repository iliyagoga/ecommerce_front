export const getTimeDifferenceInHours = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    // Если endTime меньше startTime, считаем что это следующий день
    const diffMinutes = endTotalMinutes < startTotalMinutes 
      ? (24 * 60 - startTotalMinutes) + endTotalMinutes
      : endTotalMinutes - startTotalMinutes;
    
    return diffMinutes / 60;
  };