import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/action';
import { selectAuthorizationStatus, selectUser } from '../../store/selectors';

function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);

  const isAuthorized = authorizationStatus === 'AUTH';
  const userEmail = user?.email || '';

  const handleLogout = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      localStorage.removeItem('token');
      dispatch(logout());
    },
    [dispatch]
  );

  return (
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
                    onClick={handleLogout}
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
  );
}

export default memo(Header);

