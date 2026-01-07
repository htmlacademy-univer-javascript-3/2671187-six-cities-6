type Review = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
};

type City = string;

type Offer = {
  id: string | number;
  title: string;
  type: string;
  price: number;
  image: string;
  ratingPercent: number;
  isPremium: boolean;
  isBookmarked: boolean;
  city: City;
  latitude: number;
  longitude: number;
  reviews: Review[];
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

type SortingType =
  | 'popular'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'top-rated-first';
