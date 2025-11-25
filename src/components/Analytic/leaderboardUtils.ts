export const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((segment) => segment.trim()[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || 'U';
};
