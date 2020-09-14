import format from 'date-fns/format';

const checkDate = (date) => {
  if (date) return format(new Date(...date.split('-').map(Number)), 'MMMM d, yyyy');
  return 'unknown';
};

export default checkDate;
