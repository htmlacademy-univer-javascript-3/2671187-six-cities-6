import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );
  const isAuthorized = authorizationStatus === 'AUTH';

  if (!isAuthorized) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default PrivateRoute;
