import NearbyOfferCard from '../NearbyOfferCard';

type NearbyOffersListProps = {
  offers: Offer[];
};

function NearbyOffersList({ offers }: NearbyOffersListProps): JSX.Element {
  return (
    <div className='near-places__list places__list'>
      {offers.map(offer => (
        <NearbyOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

export default NearbyOffersList;
