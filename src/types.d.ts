type Review = {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  rating: number;
  comment: string;
  date: string;
};

type PointLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type OfferCity = {
  name: string;
  location: PointLocation;
};

type City = string;

type Offer = {
  id: string | number;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  city: OfferCity;
  location: PointLocation;
  rating: number;
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
  latitude: number;
  longitude: number;
};

type OfferDetails = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  images: string[];
  city: OfferCity;
  location: PointLocation;
  goods: string[];
  host: {
    isPro: boolean;
    name: string;
    avatarUrl: string;
  };
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  bedrooms: number;
  maxAdults: number;
};

type SortingType =
  | 'popular'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'top-rated-first';

type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

type AuthInfo = {
  avatarUrl: string;
  email: string;
  id: number;
  isPro: boolean;
  name: string;
  token: string;
};
