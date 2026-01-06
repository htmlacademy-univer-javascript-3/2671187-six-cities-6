import { FC } from 'react';
import CityCard from './city-card';

interface OffersListProps {
  offers: Offer[];
}

const OffersList: FC<OffersListProps> = ({ offers }) => (
  <div className='cities__places-list places__list tabs__content'>
    {offers.map(offer => (
      <CityCard
        key={offer.id}
        mark={offer.isPremium ? 'Premium' : undefined}
        image={offer.image || ''}
        price={offer.price.toString()}
        rating={offer.ratingPercent.toString()}
        name={offer.title}
        type={offer.type || ''}
        isBookmarked={offer.isBookmarked}
        offer={offer}
      />
    ))}
  </div>
);

export default OffersList;
