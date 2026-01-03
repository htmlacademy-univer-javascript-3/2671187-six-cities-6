import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactElement;
  isAuthorized: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children, isAuthorized }) => {
  if (!isAuthorized) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default PrivateRoute;
