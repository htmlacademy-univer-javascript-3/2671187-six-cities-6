import { Link, useParams } from 'react-router-dom';
import { offers } from '../mocks/offers';
import ReviewForm from '../components/review-form';

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const offer = offers.find(o => o.id === Number(id));

  if (!offer) {
    return (
      <div className='page'>
        <h1>Предложение не найдено</h1>
        <Link to='/'>Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className='page'>
      <header className='header'>
        <div className='container'>
          <div className='header__wrapper'>
            <div className='header__left'>
              <Link className='header__logo-link' to='/'>
                <img
                  className='header__logo'
                  src='/img/logo.svg'
                  alt='6 cities logo'
                  width='81'
                  height='41'
                />
              </Link>
            </div>
            <nav className='header__nav'>
              <ul className='header__nav-list'>
                <li className='header__nav-item user'>
                  <Link
                    className='header__nav-link header__nav-link--profile'
                    to='/favorites'
                  >
                    <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                    <span className='header__user-name user__name'>
                      Oliver.conner@gmail.com
                    </span>
                    <span className='header__favorite-count'>3</span>
                  </Link>
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

      <main className='page__main page__main--offer'>
        <section className='offer'>
          <div className='offer__gallery-container container'>
            <div className='offer__gallery'>
              <div className='offer__image-wrapper'>
                <img
                  className='offer__image'
                  src={offer.image}
                  alt={offer.title}
                />
              </div>
              <div className='offer__image-wrapper'>
                <img
                  className='offer__image'
                  src={offer.image}
                  alt={offer.title}
                />
              </div>
              <div className='offer__image-wrapper'>
                <img
                  className='offer__image'
                  src={offer.image}
                  alt={offer.title}
                />
              </div>
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
                <button className='offer__bookmark-button button' type='button'>
                  <svg className='offer__bookmark-icon' width='31' height='33'>
                    <use xlinkHref='#icon-bookmark'></use>
                  </svg>
                  <span className='visually-hidden'>To bookmarks</span>
                </button>
              </div>
              <div className='offer__rating rating'>
                <div className='offer__stars rating__stars'>
                  <span style={{ width: `${offer.ratingPercent}%` }}></span>
                  <span className='visually-hidden'>Rating</span>
                </div>
                <span className='offer__rating-value rating__value'>
                  {(offer.ratingPercent / 20).toFixed(1)}
                </span>
              </div>
              <ul className='offer__features'>
                <li className='offer__feature offer__feature--entire'>
                  {offer.type}
                </li>
                <li className='offer__feature offer__feature--bedrooms'>
                  3 Bedrooms
                </li>
                <li className='offer__feature offer__feature--adults'>
                  Max 4 adults
                </li>
              </ul>
              <div className='offer__price'>
                <b className='offer__price-value'>&euro;{offer.price}</b>
                <span className='offer__price-text'>&nbsp;night</span>
              </div>
              <div className='offer__inside'>
                <h2 className='offer__inside-title'>What&apos;s inside</h2>
                <ul className='offer__inside-list'>
                  <li className='offer__inside-item'>Wi-Fi</li>
                  <li className='offer__inside-item'>Washing machine</li>
                  <li className='offer__inside-item'>Towels</li>
                  <li className='offer__inside-item'>Heating</li>
                  <li className='offer__inside-item'>Coffee machine</li>
                  <li className='offer__inside-item'>Baby seat</li>
                  <li className='offer__inside-item'>Kitchen</li>
                  <li className='offer__inside-item'>Dishwasher</li>
                  <li className='offer__inside-item'>Cable TV</li>
                  <li className='offer__inside-item'>Fridge</li>
                </ul>
              </div>
              <div className='offer__host'>
                <h2 className='offer__host-title'>Meet the host</h2>
                <div className='offer__host-user user'>
                  <div className='offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper'>
                    <img
                      className='offer__avatar user__avatar'
                      src='/img/avatar-angelina.jpg'
                      width='74'
                      height='74'
                      alt='Host avatar'
                    />
                  </div>
                  <span className='offer__user-name user__name'>Angelina</span>
                  <span className='offer__user-status user__status'>Pro</span>
                </div>
                <div className='offer__description'>
                  <p className='offer__text'>
                    A quiet cozy and picturesque that hides behind a a river by
                    the unique lightness of Amsterdam. The building is green and
                    from 18th century.
                  </p>
                  <p className='offer__text'>
                    An independent House, strategically located between Rembrand
                    Square and National Opera, but where the bustle of the city
                    comes to rest in this alley flow tree and colorful flowers.
                  </p>
                </div>
              </div>
              <section className='offer__reviews reviews'>
                <h2 className='reviews__title'>
                  Reviews &middot; <span className='reviews__amount'>12</span>
                </h2>
                <ul className='reviews__list'>
                  <li className='reviews__item'>
                    <div className='reviews__user user'>
                      <div className='reviews__avatar-wrapper user__avatar-wrapper'>
                        <img
                          className='reviews__avatar user__avatar'
                          src='/img/avatar-max.jpg'
                          width='54'
                          height='54'
                          alt='Reviews avatar'
                        />
                      </div>
                      <span className='reviews__info'>
                        <span className='reviews__user-name'>Max</span>
                        <time className='reviews__time' dateTime='2019-04-24'>
                          April 2019
                        </time>
                      </span>
                    </div>
                    <div className='reviews__comment'>
                      <p className='reviews__text'>
                        A quiet cozy and picturesque that hides behind a a river
                        by the unique lightness of Amsterdam. The building is
                        green and from 18th century.
                      </p>
                    </div>
                  </li>
                </ul>
                <ReviewForm />
              </section>
            </div>
          </div>
          <section className='offer__map map'></section>
        </section>
      </main>
    </div>
  );
}

export default OfferPage;
