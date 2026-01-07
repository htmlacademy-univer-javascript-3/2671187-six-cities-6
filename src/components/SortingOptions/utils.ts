export const SORTING_LABELS: Record<SortingType, string> = {
  popular: 'Popular',
  'price-low-to-high': 'Price: low to high',
  'price-high-to-low': 'Price: high to low',
  'top-rated-first': 'Top rated first',
};

export const sortOffers = (
  offers: Offer[],
  sortingType: SortingType
): Offer[] => {
  const offersCopy = [...offers];

  switch (sortingType) {
    case 'price-low-to-high':
      return offersCopy.sort((a, b) => a.price - b.price);
    case 'price-high-to-low':
      return offersCopy.sort((a, b) => b.price - a.price);
    case 'top-rated-first':
      return offersCopy.sort((a, b) => b.ratingPercent - a.ratingPercent);
    case 'popular':
    default:
      return offersCopy;
  }
};

