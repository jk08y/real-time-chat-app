// src/utils/formatDate.js
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatMessageDate = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};

export const formatChatListDate = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MM/dd/yyyy');
  }
};

export const formatLastSeen = (date) => {
  if (!date) return 'Unknown';
  
  return `last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
};

export const formatFullDate = (date) => {
  if (!date) return '';
  return format(date, 'MMMM d, yyyy HH:mm');
};