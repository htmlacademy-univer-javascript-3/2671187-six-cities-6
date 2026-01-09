import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import NearbyOfferCard from './nearby-offer-card';
import authReducer from '../../store/slices/auth-slice';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../store', async () => {
  const actual: typeof Object = await vi.importActual('../../store');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

vi.mock('react-router-dom', async () => {
  const actual: typeof Object = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockOffer: Offer = {
  id: '1',
  title: 'Nearby Apartment',
  type: 'apartment',
  price: 120,
  previewImage: 'nearby1.jpg',
  rating: 4.5,
  isPremium: true,
  isFavorite: false,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
  reviews: [],
};

const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

const createTestStore = (
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
    },
  });

const renderNearbyOfferCard = (
  offer: Offer,
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) => {
  const store = createTestStore(authorizationStatus);

  const v7StartTransition = true;
  const v7RelativeSplatPath = true;
  const v7StartTransitionKey = 'v7_startTransition';
  const v7RelativeSplatPathKey = 'v7_relativeSplatPath';
  const futureConfig = {
    [v7StartTransitionKey]: v7StartTransition,
    [v7RelativeSplatPathKey]: v7RelativeSplatPath,
  };

  return render(
    <Provider store={store}>
      <MemoryRouter future={futureConfig}>
        <NearbyOfferCard offer={offer} />
      </MemoryRouter>
    </Provider>
  );
};

describe('NearbyOfferCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render offer details correctly', () => {
    renderNearbyOfferCard(mockOffer);

    expect(screen.getByText('Nearby Apartment')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should display premium badge for premium offers', () => {
    renderNearbyOfferCard(mockOffer);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not display premium badge for non-premium offers', () => {
    const nonPremiumOffer = { ...mockOffer, isPremium: false };
    renderNearbyOfferCard(nonPremiumOffer);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should show active bookmark button for favorite offers', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    renderNearbyOfferCard(favoriteOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /in bookmarks/i,
    });
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('should show inactive bookmark button for non-favorite offers', () => {
    renderNearbyOfferCard(mockOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    expect(bookmarkButton).not.toHaveClass(
      'place-card__bookmark-button--active'
    );
  });

  it('should have links to offer page', () => {
    renderNearbyOfferCard(mockOffer);

    const imageLink = screen.getByRole('link', { name: /place image/i });
    expect(imageLink).toHaveAttribute('href', '/offer/1');

    const titleLink = screen.getByRole('link', {
      name: /nearby apartment/i,
    });
    expect(titleLink).toHaveAttribute('href', '/offer/1');
  });

  it('should navigate to login when unauthorized user clicks bookmark', () => {
    renderNearbyOfferCard(mockOffer, 'NO_AUTH');

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    fireEvent.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch changeFavoriteStatus when authorized user clicks bookmark', () => {
    const mockUnwrap = vi.fn().mockResolvedValue({});
    const mockAction = {
      unwrap: mockUnwrap,
    };
    mockDispatch.mockReturnValue(mockAction as any);

    renderNearbyOfferCard(mockOffer, 'AUTH');

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    fireEvent.click(bookmarkButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render image with correct attributes', () => {
    renderNearbyOfferCard(mockOffer);

    const image = screen.getByAltText('Place image');
    expect(image).toHaveAttribute('src', 'nearby1.jpg');
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should have correct CSS classes', () => {
    renderNearbyOfferCard(mockOffer);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('near-places__card', 'place-card');
  });

  it('should display rating stars with correct width', () => {
    renderNearbyOfferCard(mockOffer);

    const ratingStars = document.querySelector(
      '.place-card__stars.rating__stars'
    );
    expect(ratingStars).toBeInTheDocument();
    const span = ratingStars?.querySelector('span');
    // 4.5 rounds to 5, so 5 * 20 = 100%
    expect(span).toHaveStyle({ width: '100%' });
  });
});
