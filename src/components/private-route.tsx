import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { selectAuthorizationStatus } from '../store/selectors';

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isAuthorized = authorizationStatus === 'AUTH';

  if (!isAuthorized) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default PrivateRoute;
