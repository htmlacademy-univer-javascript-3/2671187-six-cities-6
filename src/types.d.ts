type Offer = {
  id: string | number;
  title: string;
  type: string;
  price: number;
  image: string;
  ratingPercent: number;
  isPremium: boolean;
  isBookmarked: boolean;
  latitude: number;
  longitude: number;
};

type FavoriteOffer = {
  id: string;
  title: string;
  type: string;
  price: number;
  image: string;
  ratingPercent: number;
  isPremium: boolean;
  city: string;
};
