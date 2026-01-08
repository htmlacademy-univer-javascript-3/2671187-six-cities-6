import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CitiesList from '../components/cities-list';
import OffersList from '../components/offers-list';
import Map from '../components/map';
import SortingOptions from '../components/SortingOptions';
import Spinner from '../components/spinner';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchOffers } from '../store/api-actions';
import { logout } from '../store/action';
import { sortOffers } from '../components/SortingOptions/utils';

const CITIES: City[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

const DEFAULT_MAP_CENTER: [number, number] = [
  52.3909553943508, 4.85309666406198,
];

const getFirstLocation = (offer: Offer): [number, number] => [
  offer.location.latitude,
  offer.location.longitude,
];

const MainPage: FC = () => {
  const dispatch = useAppDispatch();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const cityTab = useAppSelector(state => state.cityTab);
  const allOffers = useAppSelector(state => state.offers);
  const sorting = useAppSelector(state => state.sorting);
  const isLoading = useAppSelector(state => state.isLoading);
  const error = useAppSelector(state => state.error);
  const authorizationStatus = useAppSelector(
    state => state.authorizationStatus
  );
  const user = useAppSelector(state => state.user);

  const isAuthorized = authorizationStatus === 'AUTH';
  const userEmail = user?.email || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  // Фильтруем предложения по выбранному городу
  const cityOffers = allOffers.filter(offer => offer.city.name === cityTab);

  // Применяем сортировку
  const offers = sortOffers(cityOffers, sorting);

  // Центр карты - координаты первого предложения в выбранном городе или дефолтные
  const mapCenter: [number, number] =
    offers.length > 0 ? getFirstLocation(offers[0]) : DEFAULT_MAP_CENTER;

  return (
    <div className='page page--gray page--main'>
      <header className='header'>
        <div className='container'>
          <div className='header__wrapper'>
            <div className='header__left'>
              <Link
                className='header__logo-link header__logo-link--active'
                to='/'
              >
                <img
                  className='header__logo'
                  src='/img/logo.svg'
                  alt='6 cities logo'
                  width='81'
                  height='41'
                />
              </Link>
            </div>
            {isAuthorized ? (
              <nav className='header__nav'>
                <ul className='header__nav-list'>
                  <li className='header__nav-item user'>
                    <Link
                      className='header__nav-link header__nav-link--profile'
                      to='/favorites'
                    >
                      <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                      <span className='header__user-name user__name'>
                        {userEmail}
                      </span>
                    </Link>
                  </li>
                  <li className='header__nav-item'>
                    <a
                      className='header__nav-link'
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      <span className='header__signout'>Sign out</span>
                    </a>
                  </li>
                </ul>
              </nav>
            ) : (
              <nav className='header__nav'>
                <ul className='header__nav-list'>
                  <li className='header__nav-item'>
                    <Link className='header__nav-link' to='/login'>
                      <span className='header__login'>Sign in</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <div className='tabs'>
          <CitiesList cities={CITIES} currentCity={cityTab} />
        </div>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              {isLoading && <Spinner />}
              {error && !isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Error loading offers: {error}</p>
                  <button
                    onClick={() => {
                      dispatch(fetchOffers());
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
              {!isLoading && !error && (
                <>
                  <b className='places__found'>
                    {offers.length} places to stay in {cityTab}
                  </b>
                  <SortingOptions />
                  <OffersList offers={offers} setActiveOffer={setActiveOffer} />
                </>
              )}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
