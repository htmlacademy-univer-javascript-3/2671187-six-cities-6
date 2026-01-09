import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OffersList from './offers-list';

vi.mock('../city-card', () => ({
  default: ({
    offer,
    onCardHover,
    mark,
    price,
    name,
    type,
  }: {
    offer?: Offer;
    onCardHover?: (offer: Offer | null) => void;
    mark?: string;
    price: string;
    name: string;
    type: string;
  }) => (
    <article
      data-testid={`offer-card-${offer?.id}`}
      onMouseEnter={() => onCardHover?.(offer || null)}
      onMouseLeave={() => onCardHover?.(null)}
    >
      {mark && <span data-testid='premium-mark'>{mark}</span>}
      <span data-testid='offer-title'>{name}</span>
      <span data-testid='offer-price'>{price}</span>
      <span data-testid='offer-type'>{type}</span>
    </article>
  ),
}));

describe('OffersList component', () => {
  const mockHandleSetActiveOffer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Beautiful Apartment',
      type: 'apartment',
      price: 120,
      previewImage: 'apartment1.jpg',
      rating: 4.5,
      isPremium: true,
      isFavorite: false,
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
      reviews: [],
    },
    {
      id: '2',
      title: 'Cozy Studio',
      type: 'room',
      price: 80,
      previewImage: 'studio1.jpg',
      rating: 3.8,
      isPremium: false,
      isFavorite: true,
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
      reviews: [],
    },
  ];

  it('renders an empty list when no offers are provided', () => {
    render(
      <OffersList
        offers={[]}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    const list = document.querySelector(
      '.cities__places-list.places__list.tabs__content'
    );
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('renders each offer card', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
  });

  it('calls handleSetActiveOffer when hovering cards', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    const firstCard = screen.getByTestId('offer-card-1');
    fireEvent.mouseEnter(firstCard);
    expect(mockHandleSetActiveOffer).toHaveBeenCalledWith(mockOffers[0]);
    fireEvent.mouseLeave(firstCard);
    expect(mockHandleSetActiveOffer).toHaveBeenCalledWith(null);
  });

  it('shows premium tag only for premium offers', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    expect(screen.getByTestId('premium-mark')).toBeInTheDocument();

    const nonPremiumOffers = [mockOffers[1]];
    render(
      <OffersList
        offers={nonPremiumOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    expect(screen.queryByTestId('premium-mark')).not.toBeInTheDocument();
  });

  it('renders the cards list with expected CSS classes', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    const list = document.querySelector(
      '.cities__places-list.places__list.tabs__content'
    );
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass(
      'cities__places-list',
      'places__list',
      'tabs__content'
    );
  });

  it('renders correctly when a single offer is provided', () => {
    const singleOffer = [mockOffers[0]];
    render(
      <OffersList
        offers={singleOffer}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-card-2')).not.toBeInTheDocument();
  });

  it('renders correctly for multiple offers', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockHandleSetActiveOffer}
      />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
  });
});

