import { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: FC = () => (
  <div className='page'>
    <main className='page__main'>
      <div className='container'>
        <section className='not-found'>
          <h1 className='not-found__title'>404</h1>
          <h2 className='not-found__subtitle'>Not Found</h2>
          <p className='not-found__text'>
            The page you are looking for does not exist.
          </p>
          <Link
            to='/'
            className='not-found__link'
            tabIndex={0}
            aria-label='Go to main page'
          >
            Go to main page
          </Link>
        </section>
      </div>
    </main>
  </div>
);

export default NotFoundPage;
