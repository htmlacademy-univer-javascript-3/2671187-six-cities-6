import { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { changeSorting } from '../../store/action';
import { selectSorting } from '../../store/selectors';
import { SORTING_LABELS } from './utils';

function SortingOptions(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentSorting = useAppSelector(selectSorting);
  const [isOpen, setIsOpen] = useState(false);

  const handleSortingChange = useCallback(
    (sortingType: SortingType) => {
      dispatch(changeSorting(sortingType));
      setIsOpen(false);
    },
    [dispatch]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sortingType: SortingType) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSortingChange(sortingType);
      }
    },
    [handleSortingChange]
  );

  const sortingOptions: SortingType[] = useMemo(
    () => ['popular', 'price-low-to-high', 'price-high-to-low', 'top-rated-first'],
    []
  );

  return (
    <form className='places__sorting' action='#' method='get'>
      <span className='places__sorting-caption'>Sort by </span>
      <span
        className='places__sorting-type'
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {SORTING_LABELS[currentSorting]}
        <svg className='places__sorting-arrow' width='7' height='4'>
          <use xlinkHref='#icon-arrow-select'></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {sortingOptions.map(sortingType => (
          <li
            key={sortingType}
            className={`places__option ${
              sortingType === currentSorting ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleSortingChange(sortingType)}
            onKeyDown={event => handleKeyDown(event, sortingType)}
          >
            {SORTING_LABELS[sortingType]}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SortingOptions;

