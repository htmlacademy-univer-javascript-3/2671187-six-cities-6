import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Map from './map';
import offersReducer from '../../store/slices/offers-slice';
import { useMap } from '../../hooks/use-map';

// Mock the useMap hook
vi.mock('../../hooks/use-map', () => ({
  useMap: vi.fn(),
}));

const mockUseMap = vi.mocked(useMap);

const createTestStore = () =>
  configureStore({
    reducer: {
      offers: offersReducer,
    },
  });

describe('Map component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMap.mockReturnValue({
      mapRef: { current: document.createElement('div') },
      map: null,
    });
  });

  it('should render a div element', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <Map offers={[]} activeOffer={null} center={[48.8566, 2.3522]} />
      </Provider>
    );

    const mapDiv =
      screen.getByTestId('map-container') || document.querySelector('div');
    expect(mapDiv).toBeInTheDocument();
  });

  it('should call useMap with correct props', () => {
    const store = createTestStore();
    const testOffers: Offer[] = [
      {
        id: '1',
        title: 'Test Offer',
        type: 'apartment',
        price: 100,
        previewImage: 'test.jpg',
        rating: 4.5,
        isPremium: false,
        isFavorite: false,
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        reviews: [],
      },
    ];
    const testCenter: [number, number] = [48.8566, 2.3522];

    render(
      <Provider store={store}>
        <Map
          offers={testOffers}
          activeOffer={testOffers[0]}
          center={testCenter}
        />
      </Provider>
    );

    expect(mockUseMap).toHaveBeenCalledWith({
      offers: testOffers,
      activeOffer: testOffers[0],
      center: testCenter,
    });
  });

  it('should apply custom height when provided', () => {
    const store = createTestStore();
    const customHeight = '400px';

    render(
      <Provider store={store}>
        <Map
          offers={[]}
          activeOffer={null}
          center={[48.8566, 2.3522]}
          height={customHeight}
        />
      </Provider>
    );

    const mapDiv =
      screen.getByTestId('map-container') || document.querySelector('div');
    expect(mapDiv).toHaveStyle({ height: customHeight });
  });

  it('should use default height of "100%" when not provided', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <Map offers={[]} activeOffer={null} center={[48.8566, 2.3522]} />
      </Provider>
    );

    const mapDiv =
      screen.getByTestId('map-container') || document.querySelector('div');
    expect(mapDiv).toHaveStyle({ height: '100%' });
  });
});
