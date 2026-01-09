import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FavoritesList from './favorites-list';

vi.mock('../favorites-card/favorites-card', () => ({
  default: ({ offer }: { offer: FavoriteOffer }) => (
    <article data-testid={`favorite-card-${offer.id}`}>{offer.title}</article>
  ),
}));

describe('FavoritesList component', () => {
  const mockFavorites: FavoriteOffer[] = [
    {
      id: '1',
      title: 'Paris Apartment',
      type: 'apartment',
      price: 150,
      image: 'paris.jpg',
      ratingPercent: 80,
      isPremium: false,
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      id: '2',
      title: 'Paris Studio',
      type: 'room',
      price: 85,
      image: 'paris-studio.jpg',
      ratingPercent: 75,
      isPremium: true,
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      id: '3',
      title: 'Amsterdam House',
      type: 'house',
      price: 200,
      image: 'amsterdam.jpg',
      ratingPercent: 90,
      isPremium: false,
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041,
    },
  ];

  it('should render empty list when no favorites provided', () => {
    render(<FavoritesList favorites={[]} />);

    const list = document.querySelector('.favorites__list');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should group favorites by city', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    // Should render 2 city sections (Paris and Amsterdam)
    const locationItems = document.querySelectorAll(
      '.favorites__locations-items'
    );
    expect(locationItems).toHaveLength(2);
  });

  it('should render city names correctly', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should render favorites cards grouped by city', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    // Paris should have 2 favorites
    expect(screen.getByTestId('favorite-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-card-2')).toBeInTheDocument();

    // Amsterdam should have 1 favorite
    expect(screen.getByTestId('favorite-card-3')).toBeInTheDocument();
    expect(screen.queryByTestId('favorite-card-4')).not.toBeInTheDocument();
  });

  it('should render favorites with correct titles', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    expect(screen.getByText('Paris Apartment')).toBeInTheDocument();
    expect(screen.getByText('Paris Studio')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam House')).toBeInTheDocument();
  });

  it('should have correct CSS classes for city locations', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    const locationsContainer = document.querySelector(
      '.favorites__locations.locations.locations--current'
    );
    expect(locationsContainer).toBeInTheDocument();

    const locationItem = document.querySelector('.locations__item');
    expect(locationItem).toBeInTheDocument();

    const locationLink = document.querySelector('.locations__item-link');
    expect(locationLink).toBeInTheDocument();
  });

  it('should have correct CSS classes for favorites places', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    const favoritesPlaces = document.querySelector('.favorites__places');
    expect(favoritesPlaces).toBeInTheDocument();
  });

  it('should handle single city with single favorite', () => {
    const singleFavorite = [mockFavorites[0]]; // Just Paris Apartment
    render(<FavoritesList favorites={singleFavorite} />);

    // Should render 1 city section
    const locationItems = document.querySelectorAll(
      '.favorites__locations-items'
    );
    expect(locationItems).toHaveLength(1);

    // Should show Paris
    expect(screen.getByText('Paris')).toBeInTheDocument();

    // Should show 1 favorite
    expect(screen.getByTestId('favorite-card-1')).toBeInTheDocument();
    expect(screen.getByText('Paris Apartment')).toBeInTheDocument();
  });

  it('should handle single city with multiple favorites', () => {
    const parisFavorites = mockFavorites.slice(0, 2); // Both Paris favorites
    render(<FavoritesList favorites={parisFavorites} />);

    // Should render 1 city section
    const locationItems = document.querySelectorAll(
      '.favorites__locations-items'
    );
    expect(locationItems).toHaveLength(1);

    // Should show Paris
    expect(screen.getByText('Paris')).toBeInTheDocument();

    // Should show both favorites
    expect(screen.getByTestId('favorite-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-card-2')).toBeInTheDocument();
  });

  it('should handle multiple cities correctly', () => {
    render(<FavoritesList favorites={mockFavorites} />);

    const locationItems = document.querySelectorAll(
      '.favorites__locations-items'
    );
    expect(locationItems).toHaveLength(2);

    // Should have all cities represented
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();

    // Should have all favorites rendered
    expect(screen.getByTestId('favorite-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-card-3')).toBeInTheDocument();
  });
});
