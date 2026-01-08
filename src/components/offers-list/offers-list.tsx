import { FC } from 'react';
import CityCard from '../city-card';

type Props = {
  offers: Offer[];
  setActiveOffer: (offer: Offer | null) => void;
};

const OffersList: FC<Props> = ({ offers, setActiveOffer }) => {
  const handleCardHover = (offer: Offer | null) => {
    setActiveOffer(offer);
  };

  return (
    <div className='cities__places-list places__list tabs__content'>
      {offers.map(offer => (
        <CityCard
          key={offer.id}
          mark={offer.isPremium ? 'Premium' : undefined}
          image={offer.previewImage || ''}
          price={offer.price.toString()}
          rating={(offer.rating * 20).toString()}
          name={offer.title}
          type={offer.type || ''}
          isBookmarked={offer.isFavorite}
          onCardHover={handleCardHover}
          offer={offer}
        />
      ))}
    </div>
  );
};

export default OffersList;
