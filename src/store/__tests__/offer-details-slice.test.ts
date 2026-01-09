import { describe, it, expect } from 'vitest';
import offerDetailsReducer from '../slices/offer-details-slice';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  submitComment,
  changeFavoriteStatus,
} from '../api-actions';
import { logout } from '../slices/auth-slice';

const mockOfferDetails: OfferDetails = {
  id: '1',
  title: 'Beautiful apartment',
  description: 'A great place to stay',
  type: 'apartment',
  price: 100,
  images: ['image1.jpg', 'image2.jpg'],
  city: {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  goods: ['Wifi', 'Kitchen'],
  host: {
    isPro: true,
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
  },
  isPremium: true,
  isFavorite: false,
  rating: 4.5,
  bedrooms: 2,
  maxAdults: 4,
};

const mockNearbyOffers: Offer[] = [
  {
    id: '2',
    title: 'Nearby room',
    type: 'room',
    price: 80,
    previewImage: 'nearby.jpg',
    rating: 4.0,
    isPremium: false,
    isFavorite: false,
    city: {
      name: 'Paris',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
    reviews: [],
  },
];

const mockReview: Review = {
  id: '1',
  user: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  rating: 5,
  comment: 'Great place to stay!',
  date: '2023-12-01T00:00:00.000Z',
};

const mockComments: Review[] = [mockReview];

describe('offerDetailsSlice reducer', () => {
  const initialState = {
    currentOffer: null,
    nearbyOffers: [],
    comments: [],
    isOfferLoading: false,
    isCommentSubmitting: false,
  };

  it('should return the initial state', () => {
    const result = offerDetailsReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('fetchOfferDetails async actions', () => {
    it('should handle pending', () => {
      const action = { type: fetchOfferDetails.pending.type };
      const result = offerDetailsReducer(initialState, action);

      expect(result.isOfferLoading).toBe(true);
      expect(result.currentOffer).toBeNull();
    });

    it('should handle fulfilled', () => {
      const loadingState = {
        ...initialState,
        isOfferLoading: true,
      };

      const action = fetchOfferDetails.fulfilled(
        mockOfferDetails,
        'requestId',
        '1'
      );
      const result = offerDetailsReducer(loadingState, action);

      expect(result.isOfferLoading).toBe(false);
      expect(result.currentOffer).toEqual(mockOfferDetails);
    });

    it('should handle rejected', () => {
      const loadingState = {
        ...initialState,
        isOfferLoading: true,
      };

      const action = fetchOfferDetails.rejected(
        new Error('API Error'),
        'requestId',
        '1'
      );
      const result = offerDetailsReducer(loadingState, action);

      expect(result.isOfferLoading).toBe(false);
      expect(result.currentOffer).toBeNull();
    });
  });

  describe('fetchNearbyOffers fulfilled', () => {
    it('should set nearby offers', () => {
      const action = fetchNearbyOffers.fulfilled(
        mockNearbyOffers,
        'requestId',
        '1'
      );
      const result = offerDetailsReducer(initialState, action);

      expect(result.nearbyOffers).toEqual(mockNearbyOffers);
      expect(result.nearbyOffers).toHaveLength(1);
    });

    it('should replace existing nearby offers', () => {
      const stateWithNearby = {
        ...initialState,
        nearbyOffers: mockNearbyOffers,
      };

      const newNearbyOffers = [mockNearbyOffers[0]];
      const action = fetchNearbyOffers.fulfilled(
        newNearbyOffers,
        'requestId',
        '1'
      );
      const result = offerDetailsReducer(stateWithNearby, action);

      expect(result.nearbyOffers).toEqual(newNearbyOffers);
    });
  });

  describe('fetchComments async actions', () => {
    it('should handle fulfilled', () => {
      const action = fetchComments.fulfilled(mockComments, 'requestId', '1');
      const result = offerDetailsReducer(initialState, action);

      expect(result.comments).toEqual(mockComments);
      expect(result.comments).toHaveLength(1);
    });

    it('should handle rejected - clear comments', () => {
      const stateWithComments = {
        ...initialState,
        comments: mockComments,
      };

      const action = fetchComments.rejected(
        new Error('API Error'),
        'requestId',
        '1'
      );
      const result = offerDetailsReducer(stateWithComments, action);

      expect(result.comments).toEqual([]);
    });
  });

  describe('submitComment async actions', () => {
    it('should handle pending', () => {
      const action = { type: submitComment.pending.type };
      const result = offerDetailsReducer(initialState, action);

      expect(result.isCommentSubmitting).toBe(true);
    });

    it('should handle fulfilled - add comment to list', () => {
      const stateWithComments = {
        ...initialState,
        comments: mockComments,
        isCommentSubmitting: true,
      };

      const newComment: Review = {
        id: '2',
        user: {
          name: 'Jane Doe',
          avatarUrl: 'avatar2.jpg',
          isPro: false,
        },
        rating: 4,
        comment: 'Nice place!',
        date: '2023-12-02T00:00:00.000Z',
      };

      const action = submitComment.fulfilled(newComment, 'requestId', {
        offerId: '1',
        commentData: {
          comment: 'Nice place!',
          rating: 4,
        },
      });
      const result = offerDetailsReducer(stateWithComments, action);

      expect(result.isCommentSubmitting).toBe(false);
      expect(result.comments).toHaveLength(2);
      expect(result.comments[1]).toEqual(newComment);
    });

    it('should handle rejected', () => {
      const stateSubmitting = {
        ...initialState,
        isCommentSubmitting: true,
      };

      const action = submitComment.rejected(
        new Error('API Error'),
        'requestId',
        {
          offerId: '1',
          commentData: {
            comment: 'Nice place!',
            rating: 4,
          },
        }
      );
      const result = offerDetailsReducer(stateSubmitting, action);

      expect(result.isCommentSubmitting).toBe(false);
    });
  });

  describe('changeFavoriteStatus fulfilled', () => {
    it('should update favorite status for current offer', () => {
      const stateWithOffer = {
        ...initialState,
        currentOffer: mockOfferDetails,
      };

      const updatedOffer: Offer = {
        id: '1',
        title: mockOfferDetails.title,
        type: mockOfferDetails.type,
        price: mockOfferDetails.price,
        previewImage: mockOfferDetails.images[0],
        rating: mockOfferDetails.rating,
        isPremium: mockOfferDetails.isPremium,
        isFavorite: true,
        city: mockOfferDetails.city,
        location: mockOfferDetails.location,
        reviews: [],
      };

      const action = changeFavoriteStatus.fulfilled(updatedOffer, 'requestId', {
        offerId: '1',
        status: 1,
      });
      const result = offerDetailsReducer(stateWithOffer, action);

      expect(result.currentOffer?.isFavorite).toBe(true);
    });

    it('should not update current offer if IDs do not match', () => {
      const stateWithOffer = {
        ...initialState,
        currentOffer: mockOfferDetails,
      };

      const differentOffer: Offer = {
        id: '2',
        title: 'Different offer',
        type: 'room',
        price: 80,
        previewImage: 'image.jpg',
        rating: 4.0,
        isPremium: false,
        isFavorite: true,
        city: mockOfferDetails.city,
        location: mockOfferDetails.location,
        reviews: [],
      };

      const action = changeFavoriteStatus.fulfilled(
        differentOffer,
        'requestId',
        {
          offerId: '2',
          status: 1,
        }
      );
      const result = offerDetailsReducer(stateWithOffer, action);

      expect(result.currentOffer?.isFavorite).toBe(false);
    });

    it('should update favorite status in nearby offers', () => {
      const stateWithNearby = {
        ...initialState,
        nearbyOffers: mockNearbyOffers,
      };

      const updatedNearbyOffer: Offer = {
        ...mockNearbyOffers[0],
        isFavorite: true,
      };
      const action = changeFavoriteStatus.fulfilled(
        updatedNearbyOffer,
        'requestId',
        {
          offerId: '2',
          status: 1,
        }
      );
      const result = offerDetailsReducer(stateWithNearby, action);

      expect(result.nearbyOffers[0].isFavorite).toBe(true);
    });

    it('should not update nearby offers if IDs do not match', () => {
      const stateWithNearby = {
        ...initialState,
        nearbyOffers: mockNearbyOffers,
      };

      const differentOffer: Offer = {
        ...mockNearbyOffers[0],
        id: '3',
        isFavorite: true,
      };
      const action = changeFavoriteStatus.fulfilled(
        differentOffer,
        'requestId',
        {
          offerId: '3',
          status: 1,
        }
      );
      const result = offerDetailsReducer(stateWithNearby, action);

      expect(result.nearbyOffers[0].isFavorite).toBe(false);
    });
  });

  describe('logout action', () => {
    it('should reset favorite status for current offer', () => {
      const stateWithFavoriteOffer = {
        ...initialState,
        currentOffer: { ...mockOfferDetails, isFavorite: true },
      };

      const action = logout();
      const result = offerDetailsReducer(stateWithFavoriteOffer, action);

      expect(result.currentOffer?.isFavorite).toBe(false);
    });

    it('should reset favorite status for all nearby offers', () => {
      const stateWithFavoriteNearby = {
        ...initialState,
        nearbyOffers: mockNearbyOffers.map(offer => ({
          ...offer,
          isFavorite: true,
        })),
      };

      const action = logout();
      const result = offerDetailsReducer(stateWithFavoriteNearby, action);

      expect(result.nearbyOffers[0].isFavorite).toBe(false);
    });

    it('should handle logout with no current offer', () => {
      const action = logout();
      const result = offerDetailsReducer(initialState, action);

      expect(result.currentOffer).toBeNull();
      expect(result.nearbyOffers).toEqual([]);
    });
  });
});
