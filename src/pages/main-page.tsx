import { FC, useState } from 'react';
import OffersList from '../components/OffersList/OffersList';
import Map from '../components/Map';

interface MainPageProps {
  offers: Offer[];
}

const MainPage: FC<MainPageProps> = ({ offers }) => {
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  // Центр карты - координаты Amsterdam или первого предложения
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
          <section className='locations container'>
            <ul className='locations__list tabs__list'>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Paris'
                >
                  <span>Paris</span>
                </a>
              </li>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Cologne'
                >
                  <span>Cologne</span>
                </a>
              </li>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Brussels'
                >
                  <span>Brussels</span>
                </a>
              </li>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item tabs__item--active'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Amsterdam'
                >
                  <span>Amsterdam</span>
                </a>
              </li>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Hamburg'
                >
                  <span>Hamburg</span>
                </a>
              </li>
              <li className='locations__item'>
                <a
                  className='locations__item-link tabs__item'
                  href='#'
                  tabIndex={0}
                  aria-label='Select Dusseldorf'
                >
                  <span>Dusseldorf</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              <b className='places__found'>
                {offers.length} places to stay in Amsterdam
              </b>
              <form className='places__sorting' action='#' method='get'>
                <span className='places__sorting-caption'>Sort by</span>
                <span
                  className='places__sorting-type'
                  tabIndex={0}
                  aria-label='Sort options'
                >
                  Popular
                  <svg className='places__sorting-arrow' width='7' height='4'>
                    <use xlinkHref='#icon-arrow-select'></use>
                  </svg>
                </span>
                <ul className='places__options places__options--custom places__options--opened'>
                  <li
                    className='places__option places__option--active'
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className='places__option' tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className='places__option' tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className='places__option' tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
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
