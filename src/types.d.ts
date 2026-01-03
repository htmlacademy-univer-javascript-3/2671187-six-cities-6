type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  image: string;
  ratingPercent: number;
  isPremium: boolean;
  isBookmarked: boolean;
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

