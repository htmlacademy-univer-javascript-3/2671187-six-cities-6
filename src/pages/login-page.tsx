import { FC, useState, FormEvent, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../store/api-actions';
import { changeCity } from '../store/action';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorizationStatus } from '../store/selectors';
import { CITIES } from '../store/constants';
import Header from '../components/header';
import './login-page/login-page.css';

const validatePassword = (password: string): boolean => {
  if (password.trim().length === 0) {
    return false;
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  return hasLetter && hasDigit;
};

const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const randomCity = useMemo(
    () => CITIES[Math.floor(Math.random() * CITIES.length)],
    []
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(formData.password)) {
      setError('Password must contain at least one letter and one digit');
      return;
    }

    setIsLoading(true);

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((err: unknown) => {
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (
            err as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response === 'object'
        ) {
          const axiosError = err as {
            response: { status?: number; data?: { message?: string } };
          };
          if (axiosError.response?.status === 400) {
            setError(
              axiosError.response?.data?.message ||
                'Invalid email or password. Please check your credentials.'
            );
          } else {
            setError('Failed to sign in. Please try again.');
          }
        } else {
          setError('Failed to sign in. Please try again.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRandomCityClick = () => {
    dispatch(changeCity(randomCity));
    navigate('/');
  };

  if (authorizationStatus === 'AUTH') {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='page page--gray page--login'>
      <Header />

      <main className='page__main page__main--login'>
        <div className='page__login-container container'>
          <section className='login'>
            <h1 className='login__title'>Sign in</h1>
            <form className='login__form form' onSubmit={handleSubmit}>
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>E-mail</label>
                <input
                  className='login__input form__input'
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>Password</label>
                <input
                  className='login__input form__input'
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className='login__error'>{error}</div>}
              <button
                className='login__submit form__submit button'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
          <section className='locations locations--login locations--current'>
            <div className='locations__item'>
              <button
                className='locations__item-link'
                type='button'
                onClick={handleRandomCityClick}
              >
                <span>{randomCity}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
