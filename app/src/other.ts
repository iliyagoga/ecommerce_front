export const getTimeDifferenceInHours = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const diffMinutes = endTotalMinutes < startTotalMinutes 
      ? (24 * 60 - startTotalMinutes) + endTotalMinutes
      : endTotalMinutes - startTotalMinutes;
    
    return diffMinutes / 60;
  };

 export const extractTimeFromDateString = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Неверный формат даты');
    }
    
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };