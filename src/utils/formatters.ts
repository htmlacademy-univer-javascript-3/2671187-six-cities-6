export const getWidthByRatingPercent = (rating: number): number =>
  Math.round(rating) * 20;

export const capitalizeFirst = (text: string): string => {
  if (text.length === 0) {
    return '';
  }

  return text.charAt(0).toLocaleUpperCase() + text.substring(1);
};
