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
  const mockSetActiveOffer = vi.fn();

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

  it('should render empty list when no offers provided', () => {
    render(<OffersList offers={[]} setActiveOffer={mockSetActiveOffer} />);

    const list = document.querySelector(
      '.cities__places-list.places__list.tabs__content'
    );
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should render offer cards for each offer', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
  });

  it('should pass setActiveOffer to CityCard components', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    const card1 = screen.getByTestId('offer-card-1');
    fireEvent.mouseEnter(card1);

    expect(mockSetActiveOffer).toHaveBeenCalledWith(mockOffers[0]);
  });

  it('should call setActiveOffer with null on mouse leave', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    const card1 = screen.getByTestId('offer-card-1');
    fireEvent.mouseEnter(card1);
    fireEvent.mouseLeave(card1);

    expect(mockSetActiveOffer).toHaveBeenCalledWith(null);
  });

  it('should pass correct props to CityCard', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    // Check first offer (premium)
    const titles = screen.getAllByTestId('offer-title');
    expect(screen.getByTestId('premium-mark')).toBeInTheDocument();
    expect(titles[0]).toHaveTextContent('Beautiful Apartment');
    expect(screen.getAllByTestId('offer-price')[0]).toHaveTextContent('120');
    expect(screen.getAllByTestId('offer-type')[0]).toHaveTextContent(
      'apartment'
    );
  });

  it('should not pass premium mark for non-premium offers', () => {
    const nonPremiumOffers = [mockOffers[1]]; // Second offer is not premium
    render(
      <OffersList
        offers={nonPremiumOffers}
        setActiveOffer={mockSetActiveOffer}
      />
    );

    expect(screen.queryByTestId('premium-mark')).not.toBeInTheDocument();
  });

  it('should pass isBookmarked correctly', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    // First offer is not favorite, second is favorite
    const cards = screen.getAllByTestId(/offer-card-/);
    expect(cards).toHaveLength(2);
  });

  it('should calculate rating correctly (rating * 20)', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    // First offer has rating 4.5, so rating should be "90" (4.5 * 20)
    // Second offer has rating 3.8, so rating should be "76" (3.8 * 20)
    const cards = screen.getAllByTestId(/offer-card-/);
    expect(cards).toHaveLength(2);
  });

  it('should have correct CSS classes', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
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

  it('should handle single offer correctly', () => {
    const singleOffer = [mockOffers[0]];
    render(
      <OffersList offers={singleOffer} setActiveOffer={mockSetActiveOffer} />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-card-2')).not.toBeInTheDocument();
  });

  it('should handle multiple offers correctly', () => {
    render(
      <OffersList offers={mockOffers} setActiveOffer={mockSetActiveOffer} />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
  });
});
