import { Navigate, useNavigate } from 'react-router';
import { Pages } from '../../enums/pages.enum';
import { shallowEqual, useSelector } from 'react-redux';
import { AppState } from '../../store/redux/interfaces';
import { useEffect } from 'react';

const NotFoundRoute = ({ auth }: { auth: boolean }) => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    navigate(Pages.LOGIN);
  }, [user]);

  if (!auth) {
    return <Navigate to={Pages.LOGIN} replace />;
  }

  return null;
};

export { NotFoundRoute };
