import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import FavoritesCard from './favorites-card';

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual: typeof Object = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('../utils', () => ({
  getWidthByRatingPercent: vi.fn((percent: number) => `${percent}%`),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      offers: vi.fn(() => []),
      offerDetails: vi.fn(() => null),
      reviews: vi.fn(() => []),
      auth: vi.fn(() => ({ authorizationStatus: 'UNKNOWN', user: null })),
      favorites: vi.fn(() => []),
    },
  });

const renderFavoritesCard = (offer: FavoriteOffer) => {
  const store = createTestStore();
  const v7StartTransition = true;
  const v7RelativeSplatPath = true;
  const v7StartTransitionKey = 'v7_startTransition';
  const v7RelativeSplatPathKey = 'v7_relativeSplatPath';
  const futureConfig = {
    [v7StartTransitionKey]: v7StartTransition,
    [v7RelativeSplatPathKey]: v7RelativeSplatPath,
  };

  render(
    <Provider store={store}>
      <BrowserRouter future={futureConfig}>
        <FavoritesCard offer={offer} />
      </BrowserRouter>
    </Provider>
  );
};

describe('FavoritesCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFavoriteOffer: FavoriteOffer = {
    id: '1',
    title: 'Beautiful Apartment',
    type: 'apartment',
    price: 150,
    image: 'image.jpg',
    ratingPercent: 80,
    isPremium: true,
    city: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
  };

  it('should render favorite offer information correctly', () => {
    renderFavoritesCard(mockFavoriteOffer);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('€150')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should display premium badge when offer is premium', () => {
    renderFavoritesCard(mockFavoriteOffer);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not display premium badge when offer is not premium', () => {
    const nonPremiumOffer = { ...mockFavoriteOffer, isPremium: false };
    renderFavoritesCard(nonPremiumOffer);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render image with correct attributes', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const image = screen.getByAltText('Place image');
    expect(image).toHaveAttribute('src', 'image.jpg');
    expect(image).toHaveAttribute('width', '150');
    expect(image).toHaveAttribute('height', '110');
  });

  it('should have links to offer page', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/offer/1');
    expect(links[1]).toHaveAttribute('href', '/offer/1');
  });

  it('should have correct CSS classes', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const article = screen.getByRole('article');
    expect(article).toHaveClass('favorites__card', 'place-card');

    const imageWrapper = article.querySelector(
      '.favorites__image-wrapper.place-card__image-wrapper'
    );
    expect(imageWrapper).toBeInTheDocument();

    const infoSection = article.querySelector(
      '.favorites__card-info.place-card__info'
    );
    expect(infoSection).toBeInTheDocument();
  });

  it('should display rating stars', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const ratingElement = document.querySelector('.place-card__rating.rating');
    expect(ratingElement).toBeInTheDocument();

    const ratingStars = document.querySelector(
      '.place-card__stars.rating__stars'
    );
    expect(ratingStars).toBeInTheDocument();
  });

  it('should dispatch changeFavoriteStatus action when remove button is clicked', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const removeButton = screen.getByRole('button', { name: /in bookmarks/i });
    fireEvent.click(removeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should have bookmark button with correct classes and icon', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /in bookmarks/i,
    });
    expect(bookmarkButton).toHaveClass(
      'place-card__bookmark-button',
      'place-card__bookmark-button--active',
      'button'
    );

    const bookmarkIcon = bookmarkButton.querySelector(
      '.place-card__bookmark-icon'
    );
    expect(bookmarkIcon).toBeInTheDocument();
    expect(bookmarkIcon).toHaveAttribute('width', '18');
    expect(bookmarkIcon).toHaveAttribute('height', '19');
  });

  it('should have accessible button text', () => {
    renderFavoritesCard(mockFavoriteOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /in bookmarks/i,
    });
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('should render different offer data correctly', () => {
    const differentOffer: FavoriteOffer = {
      id: '2',
      title: 'Cozy Studio',
      type: 'room',
      price: 75,
      image: 'studio.jpg',
      ratingPercent: 60,
      isPremium: false,
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041,
    };

    renderFavoritesCard(differentOffer);

    expect(screen.getByText('Cozy Studio')).toBeInTheDocument();
    expect(screen.getByText('€75')).toBeInTheDocument();
    expect(screen.getByText('room')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/offer/2');
    expect(links[1]).toHaveAttribute('href', '/offer/2');
  });
});
