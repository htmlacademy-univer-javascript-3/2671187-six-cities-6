import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NearbyOffersList from './nearby-offers-list';

vi.mock('../nearby-offer-card/nearby-offer-card', () => ({
  default: ({ offer }: { offer: Offer }) => (
    <article data-testid={`nearby-offer-${offer.id}`}>{offer.title}</article>
  ),
}));

describe('NearbyOffersList component', () => {
  const mockOffers: Offer[] = [
    {
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
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          zoom: 10,
        },
      },
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 12,
      },
      reviews: [],
    },
    {
      id: '2',
      title: 'Nearby Studio',
      type: 'room',
      price: 80,
      previewImage: 'nearby2.jpg',
      rating: 3.8,
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
        zoom: 12,
      },
      reviews: [],
    },
  ];

  it('should render empty list when no offers provided', () => {
    render(<NearbyOffersList offers={[]} />);

    const list = document.querySelector('.near-places__list.places__list');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should render nearby offer cards for each offer', () => {
    render(<NearbyOffersList offers={mockOffers} />);

    expect(screen.getByTestId('nearby-offer-1')).toBeInTheDocument();
    expect(screen.getByTestId('nearby-offer-2')).toBeInTheDocument();
  });

  it('should render offers with correct titles', () => {
    render(<NearbyOffersList offers={mockOffers} />);

    expect(screen.getByText('Nearby Apartment')).toBeInTheDocument();
    expect(screen.getByText('Nearby Studio')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<NearbyOffersList offers={mockOffers} />);

    const list = document.querySelector('.near-places__list.places__list');
    expect(list).toBeInTheDocument();
  });

  it('should render single offer correctly', () => {
    const singleOffer = [mockOffers[0]];
    render(<NearbyOffersList offers={singleOffer} />);

    expect(screen.getByTestId('nearby-offer-1')).toBeInTheDocument();
    expect(screen.getByText('Nearby Apartment')).toBeInTheDocument();
    expect(screen.queryByTestId('nearby-offer-2')).not.toBeInTheDocument();
  });

  it('should render multiple offers correctly', () => {
    render(<NearbyOffersList offers={mockOffers} />);

    expect(screen.getByTestId('nearby-offer-1')).toBeInTheDocument();
    expect(screen.getByTestId('nearby-offer-2')).toBeInTheDocument();
    expect(screen.getByText('Nearby Apartment')).toBeInTheDocument();
    expect(screen.getByText('Nearby Studio')).toBeInTheDocument();
  });

  it('should handle offers with different properties', () => {
    const diverseOffers: Offer[] = [
      {
        ...mockOffers[0],
        id: '3',
        title: 'Premium Nearby Place',
        type: 'house',
        isPremium: true,
        isFavorite: false,
      },
      {
        ...mockOffers[1],
        id: '4',
        title: 'Budget Nearby Option',
        type: 'room',
        isPremium: false,
        isFavorite: true,
      },
    ];

    render(<NearbyOffersList offers={diverseOffers} />);

    expect(screen.getByText('Premium Nearby Place')).toBeInTheDocument();
    expect(screen.getByText('Budget Nearby Option')).toBeInTheDocument();

    expect(screen.getByTestId('nearby-offer-3')).toBeInTheDocument();
    expect(screen.getByTestId('nearby-offer-4')).toBeInTheDocument();
  });
});
