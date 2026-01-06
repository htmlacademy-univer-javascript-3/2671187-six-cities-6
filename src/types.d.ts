type Offer = {
  id: string | number;
  title: string;
  price: number;
  ratingPercent: number;
  isPremium: boolean;
  isBookmarked: boolean;
  latitude: number;
  longitude: number;
  image?: string;
  type?: string;
};
