import { useCallback } from 'react';
import { changeCity } from '../../store/action';
import { useAppDispatch } from '../../store';
import classNames from 'classnames';

type Props = {
  cities: City[];
  currentCity: City;
};

function CitiesList({ cities, currentCity }: Props): JSX.Element {
  const dispatch = useAppDispatch();

  const handleCityClick = useCallback(
    (city: City) => {
      dispatch(changeCity(city));
    },
    [dispatch]
  );

  return (
    <section className='locations container'>
      <ul className='locations__list tabs__list'>
        {cities.map(city => {
          const className = classNames('locations__item-link', 'tabs__item', {
            'tabs__item--active': city === currentCity,
          });

          return (
            <li key={city} className='locations__item'>
              <a
                className={className}
                href='#'
                onClick={e => {
                  e.preventDefault();
                  handleCityClick(city);
                }}
              >
                <span>{city}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default CitiesList;
