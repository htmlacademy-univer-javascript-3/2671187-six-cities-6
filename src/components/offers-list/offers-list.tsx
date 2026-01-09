import { FC, useCallback } from 'react';
import CityCard from '../city-card';

type Props = {
  offers: Offer[];
  handleSetActiveOffer: (offer: Offer | null) => void;
};

const OffersList: FC<Props> = ({ offers, handleSetActiveOffer }) => {
  const handleCardHover = useCallback(
    (offer: Offer | null) => {
      handleSetActiveOffer(offer);
    },
    [handleSetActiveOffer]
  );

  return (
    <div className='cities__places-list places__list tabs__content'>
      {offers.map(offer => (
        <CityCard
          key={offer.id}
          mark={offer.isPremium ? 'Premium' : undefined}
          image={offer.previewImage || ''}
          price={offer.price.toString()}
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
