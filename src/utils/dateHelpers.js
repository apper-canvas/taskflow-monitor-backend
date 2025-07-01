import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatTaskDate = (date) => {
  if (!date) return null;
  
  const taskDate = new Date(date);
  
  if (isToday(taskDate)) {
    return 'Today';
  }
  
  if (isTomorrow(taskDate)) {
    return 'Tomorrow';
  }
  
  if (isYesterday(taskDate)) {
    return 'Yesterday';
  }
  
  return format(taskDate, 'MMM d');
};

export const formatRelativeDate = (date) => {
  if (!date) return null;
  
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date() && !isToday(new Date(date));
};

export const getDueDateColor = (date, completed = false) => {
  if (completed) return 'text-gray-500';
  if (!date) return 'text-gray-500';
  
  if (isOverdue(date)) return 'text-red-600';
  if (isToday(new Date(date))) return 'text-amber-600';
  
  return 'text-gray-500';
};