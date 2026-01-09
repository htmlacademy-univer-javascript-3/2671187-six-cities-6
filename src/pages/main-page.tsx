import { FC, useState, useEffect, useCallback } from 'react';
import CitiesList from '../components/cities-list';
import OffersList from '../components/offers-list';
import Map from '../components/map';
import SortingOptions from '../components/SortingOptions';
import Spinner from '../components/spinner';
import Header from '../components/header';
import EmptyState from '../components/empty-state';
import NetworkError from '../components/network-error';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchOffers } from '../store/api-actions';
import { selectMainPageData } from '../store/selectors';
import { CITIES } from '../store/constants';

const MainPage: FC = () => {
  const dispatch = useAppDispatch();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const { cityTab, offers, isLoading, error, mapCenter } =
    useAppSelector(selectMainPageData);

  const handleSetActiveOffer = useCallback((offer: Offer | null) => {
    setActiveOffer(offer);
  }, []);

  const handleRetryOffers = useCallback(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOffers())
      .unwrap()
      .catch(() => {
        // Ошибка уже попадёт в состояние offersSlice
      });
  }, [dispatch]);

  const isEmpty = !isLoading && !error && offers.length === 0;
  const mainClassName = isEmpty
    ? 'page__main page__main--index page__main--index-empty'
    : 'page__main page__main--index';

  return (
    <div className='page page--gray page--main'>
      <Header />

      <main className={mainClassName}>
        <h1 className='visually-hidden'>Cities</h1>
        <div className='tabs'>
          <CitiesList cities={CITIES} currentCity={cityTab} />
        </div>
        <div className='cities'>
          <div
            className={
              isEmpty
                ? 'cities__places-container cities__places-container--empty container'
                : 'cities__places-container container'
            }
          >
            {isLoading && (
              <section className='cities__places places'>
                <h2 className='visually-hidden'>Places</h2>
                <Spinner />
              </section>
            )}
            {error && !isLoading && (
              <section className='cities__places places'>
                <h2 className='visually-hidden'>Places</h2>
                <NetworkError
                  handleClick={handleRetryOffers}
                  loadables='offers'
                  error={error}
                />
              </section>
            )}
            {isEmpty && <EmptyState cityName={cityTab} />}
            {!isLoading && !error && !isEmpty && (
              <>
                <section className='cities__places places'>
                  <h2 className='visually-hidden'>Places</h2>
                  <b className='places__found'>
                    {offers.length} places to stay in {cityTab}
                  </b>
                  <SortingOptions />
                  <OffersList
                    offers={offers}
                    handleSetActiveOffer={handleSetActiveOffer}
                  />
                </section>
                <div className='cities__right-section'>
                  <section className='cities__map map'>
                    <Map
                      offers={offers}
                      activeOffer={activeOffer}
                      center={mapCenter}
                    />
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
