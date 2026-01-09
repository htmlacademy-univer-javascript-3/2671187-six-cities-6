import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { configureStore } from '@reduxjs/toolkit';
import {
  fetchOffers,
  checkAuth,
  login,
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  submitComment,
  fetchFavorites,
  changeFavoriteStatus,
} from '../api-actions';
import offersReducer from '../slices/offers-slice';
import offerDetailsReducer from '../slices/offer-details-slice';
import authReducer from '../slices/auth-slice';
import favoritesReducer from '../slices/favorites-slice';
import { createAPI } from '../../services/api';

const api = createAPI();
const mock = new MockAdapter(api);

const createTestStore = () =>
  configureStore({
    reducer: {
      offers: offersReducer,
      offerDetails: offerDetailsReducer,
      auth: authReducer,
      favorites: favoritesReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });

const store = createTestStore();

describe('API Actions', () => {
  beforeEach(() => {
    mock.reset();
  });

  describe('fetchOffers', () => {
    it('should dispatch fulfilled when API call succeeds', async () => {
      const mockOffers: Offer[] = [
        {
          id: '1',
          title: 'Test Offer',
          type: 'apartment',
          price: 100,
          previewImage: 'test.jpg',
          rating: 4.5,
          isPremium: true,
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

      mock.onGet('/offers').reply(200, mockOffers);

      const result = await store.dispatch(fetchOffers());

      expect(result.type).toBe(fetchOffers.fulfilled.type);
      expect(result.payload).toEqual(mockOffers);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.onGet('/offers').reply(500);

      const result = await store.dispatch(fetchOffers());

      expect(result.type).toBe(fetchOffers.rejected.type);
    });
  });

  describe('checkAuth', () => {
    it('should dispatch fulfilled when API call succeeds', async () => {
      const mockUser: AuthInfo = {
        id: 1,
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'john@example.com',
        token: 'test-token',
      };

      mock.onGet('/login').reply(200, mockUser);

      const result = await store.dispatch(checkAuth());

      expect(result.type).toBe(checkAuth.fulfilled.type);
      expect(result.payload).toBeUndefined();
    });

    it('should dispatch fulfilled when API call fails (error handled internally)', async () => {
      mock.onGet('/login').reply(401);

      const result = await store.dispatch(checkAuth());

      expect(result.type).toBe(checkAuth.fulfilled.type);
      expect(result.payload).toBeUndefined();
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should dispatch fulfilled with user data when login succeeds', async () => {
      const mockUser: AuthInfo = {
        id: 1,
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@example.com',
        token: 'test-token',
      };

      mock.onPost('/login', loginData).reply(200, mockUser);

      const result = await store.dispatch(login(loginData));

      expect(result.type).toBe(login.fulfilled.type);
      expect(result.payload).toEqual(mockUser);
    });

    it('should dispatch rejected when login fails', async () => {
      mock
        .onPost('/login', loginData)
        .reply(400, { message: 'Invalid credentials' });

      const result = await store.dispatch(login(loginData));

      expect(result.type).toBe(login.rejected.type);
    });
  });

  describe('fetchOfferDetails', () => {
    const offerId = '1';

    it('should dispatch fulfilled with offer details when API call succeeds', async () => {
      const mockOfferDetails: OfferDetails = {
        id: '1',
        title: 'Beautiful apartment',
        description: 'A great place to stay',
        type: 'apartment',
        price: 100,
        images: ['image1.jpg'],
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
        goods: ['Wifi'],
        host: {
          isPro: true,
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
        },
        isPremium: true,
        isFavorite: false,
        rating: 4.5,
        bedrooms: 1,
        maxAdults: 2,
      };

      mock.onGet(`/offers/${offerId}`).reply(200, mockOfferDetails);

      const result = await store.dispatch(fetchOfferDetails(offerId));

      expect(result.type).toBe(fetchOfferDetails.fulfilled.type);
      expect(result.payload).toEqual(mockOfferDetails);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.onGet(`/offers/${offerId}`).reply(404);

      const result = await store.dispatch(fetchOfferDetails(offerId));

      expect(result.type).toBe(fetchOfferDetails.rejected.type);
    });
  });

  describe('fetchNearbyOffers', () => {
    const offerId = '1';

    it('should dispatch fulfilled with nearby offers when API call succeeds', async () => {
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

      mock.onGet(`/offers/${offerId}/nearby`).reply(200, mockNearbyOffers);

      const result = await store.dispatch(fetchNearbyOffers(offerId));

      expect(result.type).toBe(fetchNearbyOffers.fulfilled.type);
      expect(result.payload).toEqual(mockNearbyOffers);
    });
  });

  describe('fetchComments', () => {
    const offerId = '1';

    it('should dispatch fulfilled with comments when API call succeeds', async () => {
      const mockComments: Review[] = [
        {
          id: '1',
          user: {
            name: 'John Doe',
            avatarUrl: 'avatar.jpg',
            isPro: true,
          },
          rating: 5,
          comment: 'Great place!',
          date: '2023-12-01T00:00:00.000Z',
        },
      ];

      mock.onGet(`/comments/${offerId}`).reply(200, mockComments);

      const result = await store.dispatch(fetchComments(offerId));

      expect(result.type).toBe(fetchComments.fulfilled.type);
      expect(result.payload).toEqual(mockComments);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.onGet(`/comments/${offerId}`).reply(500);

      const result = await store.dispatch(fetchComments(offerId));

      expect(result.type).toBe(fetchComments.rejected.type);
    });
  });

  describe('submitComment', () => {
    const offerId = '1';
    const commentData = {
      comment: 'Great place to stay!',
      rating: 5,
    };

    it('should dispatch fulfilled with new comment when API call succeeds', async () => {
      const mockNewComment: Review = {
        id: '2',
        user: {
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
        rating: 5,
        comment: 'Great place to stay!',
        date: new Date().toISOString(),
      };

      mock
        .onPost(`/comments/${offerId}`, commentData)
        .reply(200, mockNewComment);

      const result = await store.dispatch(
        submitComment({ offerId, commentData })
      );

      expect(result.type).toBe(submitComment.fulfilled.type);
      expect(result.payload).toEqual(mockNewComment);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.onPost(`/comments/${offerId}`, commentData).reply(400);

      const result = await store.dispatch(
        submitComment({ offerId, commentData })
      );

      expect(result.type).toBe(submitComment.rejected.type);
    });
  });

  describe('fetchFavorites', () => {
    it('should dispatch fulfilled with favorites when API call succeeds', async () => {
      const mockFavorites: Offer[] = [
        {
          id: '1',
          title: 'Favorite apartment',
          type: 'apartment',
          price: 120,
          previewImage: 'fav.jpg',
          rating: 4.8,
          isPremium: true,
          isFavorite: true,
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

      mock.onGet('/favorite').reply(200, mockFavorites);

      const result = await store.dispatch(fetchFavorites());

      expect(result.type).toBe(fetchFavorites.fulfilled.type);
      expect(result.payload).toEqual(mockFavorites);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.onGet('/favorite').reply(500);

      const result = await store.dispatch(fetchFavorites());

      expect(result.type).toBe(fetchFavorites.rejected.type);
    });
  });

  describe('changeFavoriteStatus', () => {
    const favoriteData = {
      offerId: '1',
      status: 1 as const,
    };

    it('should dispatch fulfilled with updated offer when API call succeeds', async () => {
      const mockUpdatedOffer: Offer = {
        id: '1',
        title: 'Updated apartment',
        type: 'apartment',
        price: 100,
        previewImage: 'test.jpg',
        rating: 4.5,
        isPremium: true,
        isFavorite: true,
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
      };

      mock.reset();
      mock.onPost('/favorite/1/1').reply(200, mockUpdatedOffer);

      const result = await store.dispatch(changeFavoriteStatus(favoriteData));

      expect(result.type).toBe(changeFavoriteStatus.fulfilled.type);
      expect(result.payload).toEqual(mockUpdatedOffer);
    });

    it('should dispatch rejected when API call fails', async () => {
      mock.reset();
      mock.onPost('/favorite/1/1').reply(500);

      const result = await store.dispatch(changeFavoriteStatus(favoriteData));

      expect(result.type).toBe(changeFavoriteStatus.rejected.type);
    });

    it('should handle status 0 (remove from favorites)', async () => {
      const removeData = {
        offerId: '1',
        status: 0 as const,
      };

      const mockUpdatedOffer: Offer = {
        id: '1',
        title: 'Updated apartment',
        type: 'apartment',
        price: 100,
        previewImage: 'test.jpg',
        rating: 4.5,
        isPremium: true,
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
      };

      mock.reset();
      mock.onPost('/favorite/1/0').reply(200, mockUpdatedOffer);

      const result = await store.dispatch(changeFavoriteStatus(removeData));

      expect(result.type).toBe(changeFavoriteStatus.fulfilled.type);
      expect(result.payload).toEqual(mockUpdatedOffer);
    });
  });
});
