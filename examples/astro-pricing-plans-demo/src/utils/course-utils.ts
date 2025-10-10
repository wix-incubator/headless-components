/**
 * Gets the appropriate CSS class for a course level badge
 */
export const getLevelBadgeClass = (level: string): string => {
  switch (level) {
    case 'Beginner':
      return 'bg-gradient-to-r from-green-500 to-green-400 text-white';
    case 'Intermediate':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white';
    case 'Advanced':
      return 'bg-gradient-to-r from-red-500 to-red-400 text-white';
    default:
      return 'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white';
  }
};
