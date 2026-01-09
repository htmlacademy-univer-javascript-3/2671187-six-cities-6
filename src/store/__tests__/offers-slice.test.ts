import { describe, it, expect } from 'vitest';
import { changeCity, setOffers, changeSorting } from '../slices/offers-slice';
import { fetchOffers, changeFavoriteStatus } from '../api-actions';
import { logout } from '../slices/auth-slice';
import offersReducer from '../slices/offers-slice';

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 100,
    previewImage: 'image1.jpg',
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
  {
    id: '2',
    title: 'Cozy room',
    type: 'room',
    price: 80,
    previewImage: 'image2.jpg',
    rating: 4.0,
    isPremium: false,
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

describe('offersSlice reducer', () => {
  const initialState = {
    cityTab: 'Paris' as const,
    offers: [],
    sorting: 'popular' as const,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const result = offersReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('changeCity action', () => {
    it('should change the city tab', () => {
      const action = changeCity('Amsterdam');
      const result = offersReducer(initialState, action);

      expect(result.cityTab).toBe('Amsterdam');
      expect(result.offers).toEqual([]);
      expect(result.sorting).toBe('popular');
    });

    it('should change to different cities', () => {
      const cities: City[] = ['Cologne', 'Brussels', 'Hamburg', 'Dusseldorf'];

      cities.forEach(city => {
        const action = changeCity(city);
        const result = offersReducer(initialState, action);
        expect(result.cityTab).toBe(city);
      });
    });
  });

  describe('setOffers action', () => {
    it('should set offers data', () => {
      const action = setOffers(mockOffers);
      const result = offersReducer(initialState, action);

      expect(result.offers).toEqual(mockOffers);
      expect(result.offers).toHaveLength(2);
    });

    it('should replace existing offers', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const newOffers = [mockOffers[0]];
      const action = setOffers(newOffers);
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers).toEqual(newOffers);
      expect(result.offers).toHaveLength(1);
    });
  });

  describe('changeSorting action', () => {
    it('should change sorting type to price-low-to-high', () => {
      const action = changeSorting('price-low-to-high');
      const result = offersReducer(initialState, action);

      expect(result.sorting).toBe('price-low-to-high');
    });

    it('should change sorting type to price-high-to-low', () => {
      const action = changeSorting('price-high-to-low');
      const result = offersReducer(initialState, action);

      expect(result.sorting).toBe('price-high-to-low');
    });

    it('should change sorting type to top-rated-first', () => {
      const action = changeSorting('top-rated-first');
      const result = offersReducer(initialState, action);

      expect(result.sorting).toBe('top-rated-first');
    });

    it('should change sorting type back to popular', () => {
      const stateWithSorting = {
        ...initialState,
        sorting: 'price-low-to-high' as const,
      };

      const action = changeSorting('popular');
      const result = offersReducer(stateWithSorting, action);

      expect(result.sorting).toBe('popular');
    });
  });

  describe('fetchOffers async actions', () => {
    it('should handle pending', () => {
      const action = { type: fetchOffers.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchOffers.fulfilled(mockOffers, 'requestId', undefined);
      const result = offersReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.offers).toEqual(mockOffers);
      expect(result.error).toBeNull();
    });

    it('should handle rejected', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchOffers.rejected(
        new Error('API Error'),
        'requestId',
        undefined
      );
      const result = offersReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should handle rejected with default error message', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchOffers.rejected(
        { message: undefined } as Error,
        'requestId',
        undefined
      );
      const result = offersReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Failed to load offers');
    });
  });

  describe('changeFavoriteStatus fulfilled', () => {
    it('should update favorite status for existing offer', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const updatedOffer = { ...mockOffers[0], isFavorite: true };
      const action = changeFavoriteStatus.fulfilled(updatedOffer, 'requestId', {
        offerId: '1',
        status: 1,
      });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(true); // unchanged
    });

    it('should remove favorite status for existing offer', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const updatedOffer = { ...mockOffers[1], isFavorite: false };
      const action = changeFavoriteStatus.fulfilled(updatedOffer, 'requestId', {
        offerId: '2',
        status: 0,
      });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(false); // unchanged
      expect(result.offers[1].isFavorite).toBe(false);
    });

    it('should not affect non-existing offer', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const updatedOffer = { ...mockOffers[0], id: '999', isFavorite: true };
      const action = changeFavoriteStatus.fulfilled(updatedOffer, 'requestId', {
        offerId: '999',
        status: 1,
      });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(false);
      expect(result.offers[1].isFavorite).toBe(true);
    });
  });

  describe('logout action', () => {
    it('should reset all offers favorite status to false', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const action = logout();
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(false);
      expect(result.offers[1].isFavorite).toBe(false);
    });

    it('should handle logout with empty offers array', () => {
      const action = logout();
      const result = offersReducer(initialState, action);

      expect(result.offers).toEqual([]);
    });
  });
});
