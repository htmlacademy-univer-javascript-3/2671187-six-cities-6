import { FC, useState } from 'react';
import CitiesList from '../components/cities-list';
import OffersList from '../components/offers-list';
import Map from '../components/map';
import SortingOptions from '../components/SortingOptions';
import { useAppSelector } from '../store';
import { sortOffers } from '../components/SortingOptions/utils';

const CITIES: City[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

const MainPage: FC = () => {
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const city = useAppSelector(state => state.city);
  const allOffers = useAppSelector(state => state.offers);
  const sorting = useAppSelector(state => state.sorting);

  // Фильтруем предложения по выбранному городу
  const cityOffers = allOffers.filter(offer => offer.city === city);

  // Применяем сортировку
  const offers = sortOffers(cityOffers, sorting);

  // Центр карты - координаты первого предложения в выбранном городе или дефолтные
  const mapCenter: [number, number] =
    offers.length > 0
      ? [offers[0].latitude, offers[0].longitude]
      : [52.3909553943508, 4.85309666406198];

  return (
    <div className='page page--gray page--main'>
      <header className='header'>
        <div className='container'>
          <div className='header__wrapper'>
            <div className='header__left'>
              <a
                className='header__logo-link header__logo-link--active'
                href='/'
              >
                <img
                  className='header__logo'
                  src='/img/logo.svg'
                  alt='6 cities logo'
                  width='81'
                  height='41'
                />
              </a>
            </div>
            <nav className='header__nav'>
              <ul className='header__nav-list'>
                <li className='header__nav-item user'>
                  <a
                    className='header__nav-link header__nav-link--profile'
                    href='/profile'
                  >
                    <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                    <span className='header__user-name user__name'>
                      Oliver.conner@gmail.com
                    </span>
                    <span className='header__favorite-count'>3</span>
                  </a>
                </li>
                <li className='header__nav-item'>
                  <a className='header__nav-link' href='/logout'>
                    <span className='header__signout'>Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <div className='tabs'>
          <CitiesList cities={CITIES} currentCity={city} />
        </div>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              <b className='places__found'>
                {offers.length} places to stay in {city}
              </b>
              <SortingOptions />
              <OffersList offers={offers} setActiveOffer={setActiveOffer} />
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
