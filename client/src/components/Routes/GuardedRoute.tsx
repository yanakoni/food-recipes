import { Navigate } from 'react-router';
import { Pages } from '../../enums/pages.enum';

const GuardedRoute = ({ auth, children }: { auth: boolean; children: any }) => {
  if (!auth) {
    return <Navigate to={Pages.LOGIN} replace />;
  }

  return children;
};

export { GuardedRoute };
