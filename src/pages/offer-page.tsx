import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useAppSelector, useAppDispatch } from '../store';
import ReviewsList from '../components/reviews-list';
import Map from '../components/map';
import NearbyOffersList from '../components/nearby-offers-list';
import Spinner from '../components/spinner';
import Header from '../components/header';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  changeFavoriteStatus,
} from '../store/api-actions';
import { getWidthByRatingPercent } from '../utils';
import {
  selectCurrentOffer,
  selectNearbyOffers,
  selectComments,
  selectIsOfferLoading,
  selectAuthorizationStatus,
} from '../store/selectors';

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const currentOffer = useAppSelector(selectCurrentOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const comments = useAppSelector(selectComments);
  const isOfferLoading = useAppSelector(selectIsOfferLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  // Мемоизируем массив offers для Map
  const mapOffers = useMemo(() => {
    if (!currentOffer) {
      return nearbyOffers;
    }
    // Конвертируем OfferDetails в Offer для карты
    const offerForMap: Offer = {
      id: currentOffer.id,
      title: currentOffer.title,
      type: currentOffer.type,
      price: currentOffer.price,
      previewImage: currentOffer.images[0] || '',
      rating: currentOffer.rating,
      isPremium: currentOffer.isPremium,
      isFavorite: currentOffer.isFavorite,
      city: currentOffer.city,
      location: currentOffer.location,
      reviews: comments,
    };
    return [...nearbyOffers, offerForMap];
  }, [nearbyOffers, currentOffer, comments]);

  // Спиннер
  if (isOfferLoading || !currentOffer) {
    return (
      <div className='page'>
        <Header />
        <main className='page__main page__main--offer'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  // Если загрузка завершена и предложения нет (404)
  if (!isOfferLoading && !currentOffer && id) {
    return <Navigate to='/404' replace />;
  }

  const offer = currentOffer;

  const handleBookmarkClick = () => {
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }

    if (offer) {
      const newStatus = offer.isFavorite ? 0 : 1;
      dispatch(changeFavoriteStatus({ offerId: offer.id, status: newStatus }));
    }
  };

  return (
    <div className='page'>
      <Header />

      <main className='page__main page__main--offer'>
        <section className='offer'>
          <div className='offer__gallery-container container'>
            <div className='offer__gallery'>
              {offer.images.map((image, index) => (
                <div key={image} className='offer__image-wrapper'>
                  <img
                    className='offer__image'
                    src={image}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='offer__container container'>
            <div className='offer__wrapper'>
              {offer.isPremium && (
                <div className='offer__mark'>
                  <span>Premium</span>
                </div>
              )}
              <div className='offer__name-wrapper'>
                <h1 className='offer__name'>{offer.title}</h1>
                <button
                  className={classNames(
                    'offer__bookmark-button',
                    'button',
                    offer.isFavorite && 'offer__bookmark-button--active'
                  )}
                  type='button'
                  onClick={handleBookmarkClick}
                >
                  <svg className='offer__bookmark-icon' width='31' height='33'>
                    <use xlinkHref='#icon-bookmark'></use>
                  </svg>
                  <span className='visually-hidden'>
                    {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className='offer__rating rating'>
                <div className='offer__stars rating__stars'>
                  <span
                    style={{
                      width: `${getWidthByRatingPercent(offer.rating)}%`,
                    }}
                  ></span>
                  <span className='visually-hidden'>Rating</span>
                </div>
                <span className='offer__rating-value rating__value'>
                  {offer.rating.toFixed(1)}
                </span>
              </div>
              <ul className='offer__features'>
                <li className='offer__feature offer__feature--entire'>
                  {offer.type}
                </li>
                <li className='offer__feature offer__feature--bedrooms'>
                  {offer.bedrooms} Bedroom{offer.bedrooms !== 1 ? 's' : ''}
                </li>
                <li className='offer__feature offer__feature--adults'>
                  Max {offer.maxAdults} adult{offer.maxAdults !== 1 ? 's' : ''}
                </li>
              </ul>
              <div className='offer__price'>
                <b className='offer__price-value'>&euro;{offer.price}</b>
                <span className='offer__price-text'>&nbsp;night</span>
              </div>
              <div className='offer__inside'>
                <h2 className='offer__inside-title'>What&apos;s inside</h2>
                <ul className='offer__inside-list'>
                  {offer.goods.map(good => (
                    <li key={good} className='offer__inside-item'>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='offer__host'>
                <h2 className='offer__host-title'>Meet the host</h2>
                <div className='offer__host-user user'>
                  <div
                    className={`offer__avatar-wrapper ${
                      offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img
                      className='offer__avatar user__avatar'
                      src={offer.host.avatarUrl}
                      width='74'
                      height='74'
                      alt='Host avatar'
                    />
                  </div>
                  <span className='offer__user-name user__name'>
                    {offer.host.name}
                  </span>
                  {offer.host.isPro && (
                    <span className='offer__user-status user__status'>Pro</span>
                  )}
                </div>
                <div className='offer__description'>
                  <p className='offer__text'>{offer.description}</p>
                </div>
              </div>
              <ReviewsList reviews={comments} />
            </div>
          </div>
          <section className='offer__map map'>
            <Map
              offers={mapOffers}
              activeOffer={mapOffers.find(o => o.id === offer.id) || null}
              center={[offer.location.latitude, offer.location.longitude]}
            />
          </section>
        </section>
        <div className='container'>
          <section className='near-places places'>
            <h2 className='near-places__title'>
              Other places in the neighbourhood
            </h2>
            <NearbyOffersList offers={nearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
