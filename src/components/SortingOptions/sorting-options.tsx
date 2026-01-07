import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { changeSorting } from '../../store/reducer';
import { SORTING_LABELS } from './utils';

function SortingOptions(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentSorting = useAppSelector((state) => state.sorting);
  const [isOpen, setIsOpen] = useState(false);

  const handleSortingChange = (sortingType: SortingType) => {
    dispatch(changeSorting(sortingType));
    setIsOpen(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    sortingType: SortingType
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSortingChange(sortingType);
    }
  };

  const sortingOptions: SortingType[] = [
    'popular',
    'price-low-to-high',
    'price-high-to-low',
    'top-rated-first',
  ];

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {SORTING_LABELS[currentSorting]}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {sortingOptions.map((sortingType) => (
          <li
            key={sortingType}
            className={`places__option ${
              sortingType === currentSorting ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleSortingChange(sortingType)}
            onKeyDown={(event) => handleKeyDown(event, sortingType)}
          >
            {SORTING_LABELS[sortingType]}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SortingOptions;

