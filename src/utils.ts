export const getWidthByRatingPercent = (rating: number): number => {
  const roundedRating = Math.round(rating);
  return (roundedRating / 5) * 100;
};
