import './network-error.css';

type Props = {
  handleClick: () => void;
  loadables: string;
  error: string;
};

function NetworkError({ handleClick, loadables, error }: Props): JSX.Element {
  return (
    <div className='network-error'>
      <p className='network-error__message'>
        Error loading {loadables}: {error}
      </p>
      <button
        className='network-error__button'
        type='button'
        onClick={handleClick}
      >
        Try again
      </button>
    </div>
  );
}

export default NetworkError;

