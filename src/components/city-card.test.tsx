import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import CityCard from './city-card';
import authReducer from '../store/slices/auth-slice';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../store', async () => {
  const actual: typeof Object = await vi.importActual('../store');
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
  title: 'Beautiful Apartment in Paris',
  type: 'apartment',
  price: 120,
  previewImage: 'apartment.jpg',
  rating: 4.5,
  isPremium: true,
  isFavorite: false,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
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

const mockOnCardHover = vi.fn();

const renderCityCard = (props: {
  mark?: string;
  image: string;
  price: string;
  rating: string;
  name: string;
  type: string;
  isBookmarked: boolean;
  offer?: Offer;
  authorizationStatus?: 'AUTH' | 'NO_AUTH' | 'UNKNOWN';
}) => {
  const store = createTestStore(props.authorizationStatus || 'UNKNOWN');

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
        <CityCard
          mark={props.mark}
          image={props.image}
          price={props.price}
          rating={props.rating}
          name={props.name}
          type={props.type}
          isBookmarked={props.isBookmarked}
          offer={props.offer}
          onCardHover={mockOnCardHover}
        />
      </MemoryRouter>
    </Provider>
  );
};

describe('CityCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render offer details correctly', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment in Paris',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    expect(
      screen.getByText('Beautiful Apartment in Paris')
    ).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should display premium mark when provided', () => {
    renderCityCard({
      mark: 'Premium',
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not display premium mark when not provided', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should call onCardHover on mouse enter when offer is provided', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);

    expect(mockOnCardHover).toHaveBeenCalledWith(mockOffer);
  });

  it('should call onCardHover with null on mouse leave', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const card = screen.getByRole('article');
    fireEvent.mouseLeave(card);

    expect(mockOnCardHover).toHaveBeenCalledWith(null);
  });

  it('should not call onCardHover on mouse enter when offer is not provided', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
    });

    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);

    expect(mockOnCardHover).not.toHaveBeenCalled();
  });

  it('should navigate to login when unauthorized user clicks bookmark', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
      authorizationStatus: 'NO_AUTH',
    });

    const bookmarkButton = screen.getByRole('button', {
      name: /add to bookmarks/i,
    });
    fireEvent.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch changeFavoriteStatus when authorized user clicks bookmark', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
      authorizationStatus: 'AUTH',
    });

    const bookmarkButton = screen.getByRole('button', {
      name: /add to bookmarks/i,
    });
    fireEvent.click(bookmarkButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show active bookmark button when isBookmarked is true', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: true,
      offer: mockOffer,
    });

    const bookmarkButton = screen.getByRole('button', {
      name: /remove from bookmarks/i,
    });
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('should show inactive bookmark button when isBookmarked is false', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const bookmarkButton = screen.getByRole('button', {
      name: /add to bookmarks/i,
    });
    expect(bookmarkButton).not.toHaveClass(
      'place-card__bookmark-button--active'
    );
  });

  it('should have links to offer page when offer is provided', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const imageLink = screen.getByRole('link', {
      name: /view beautiful apartment/i,
    });
    expect(imageLink).toHaveAttribute('href', '/offer/1');

    const titleLink = screen.getByRole('link', {
      name: /view beautiful apartment/i,
    });
    expect(titleLink).toHaveAttribute('href', '/offer/1');
  });

  it('should not have links when offer is not provided', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
    });

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('should render image with correct attributes', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const image = screen.getByAltText('Beautiful Apartment');
    expect(image).toHaveAttribute('src', 'apartment.jpg');
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should have correct CSS classes', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const card = screen.getByRole('article');
    expect(card).toHaveClass('cities__card', 'place-card');
  });

  it('should display rating stars with correct width', () => {
    renderCityCard({
      image: 'apartment.jpg',
      price: '120',
      rating: '90%',
      name: 'Beautiful Apartment',
      type: 'apartment',
      isBookmarked: false,
      offer: mockOffer,
    });

    const ratingStars = document.querySelector(
      '.place-card__stars.rating__stars'
    );
    expect(ratingStars).toBeInTheDocument();
    const span = ratingStars?.querySelector('span');
    expect(span).toHaveStyle({ width: '90%' });
  });
});
