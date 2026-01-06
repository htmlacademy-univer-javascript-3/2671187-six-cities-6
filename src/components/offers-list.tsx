import { FC, useState } from 'react';
import CityCard from './city-card';

interface OffersListProps {
  offers: Offer[];
}

const OffersList: FC<OffersListProps> = ({ offers }) => {
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  return (
    <div className='cities__places-list places__list tabs__content'>
      {offers.map((offer) => (
        <CityCard
          key={offer.id}
          offer={offer}
          setActiveOffer={setActiveOffer}
        />
      ))}
    </div>
  );
};

export default OffersList;

