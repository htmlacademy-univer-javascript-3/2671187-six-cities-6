import { describe, it, expect } from 'vitest';
import {
  selectNearbyOffers,
  selectOfferError,
  selectCommentsSortedLimited,
  selectMainPageData,
} from './selectors';
import { RootState } from './index';

const cityLocation = {
  latitude: 48.8566,
  longitude: 2.3522,
  zoom: 10,
};

const sampleCity = {
  name: 'Paris',
  location: cityLocation,
};

const generateOffer = (id: string): Offer => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 100,
  previewImage: `img-${id}.jpg`,
  isPremium: false,
  isFavorite: false,
  city: sampleCity,
  location: cityLocation,
  rating: 4.2,
  reviews: [],
});

const sampleReviews: Review[] = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  user: {
    name: `User ${index + 1}`,
    avatarUrl: `avatar-${index + 1}.jpg`,
    isPro: false,
  },
  rating: 5 - (index % 5),
  comment: `Comment ${index + 1}`,
  date: new Date(2025, 0, index + 1).toISOString(),
}));

const mockState: RootState = {
  offers: {
    cityTab: 'Paris',
    offers: [generateOffer('1'), generateOffer('2')],
    sorting: 'popular',
    isLoading: false,
    error: 'Offers failed to load',
  },
  auth: {
    authorizationStatus: 'AUTH',
    user: null,
  },
  offerDetails: {
    currentOffer: null,
    nearbyOffers: [
      generateOffer('a'),
      generateOffer('b'),
      generateOffer('c'),
      generateOffer('d'),
    ],
    comments: sampleReviews,
    isOfferLoading: false,
    isCommentSubmitting: false,
    error: 'Details unavailable',
  },
  favorites: {
    favorites: [],
    isLoading: false,
    error: null,
  },
};

describe('Selectors', () => {
  it('selectNearbyOffers returns only the first three nearby offers', () => {
    const nearby = selectNearbyOffers(mockState);
    expect(nearby).toHaveLength(3);
    expect(nearby.map(offer => offer.id)).toEqual(['a', 'b', 'c']);
  });

  it('selectOfferError returns offerDetails.error', () => {
    expect(selectOfferError(mockState)).toBe('Details unavailable');
  });

  it('selectCommentsSortedLimited returns newest 10 comments sorted by date', () => {
    const comments = selectCommentsSortedLimited(mockState);
    expect(comments).toHaveLength(10);
    expect(comments[0].id).toBe('12');
    expect(comments[comments.length - 1].id).toBe('3');
  });

  it('selectMainPageData includes map center and error from offers state', () => {
    const mainPageData = selectMainPageData(mockState);
    expect(mainPageData.mapCenter).toEqual([
      cityLocation.latitude,
      cityLocation.longitude,
    ]);
    expect(mainPageData.error).toBe('Offers failed to load');
    expect(mainPageData.cityTab).toBe('Paris');
  });
});
