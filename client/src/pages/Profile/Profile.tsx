import { shallowEqual, useSelector } from 'react-redux';
import { AppState } from '../../store/redux/interfaces';
import { Col } from 'reactstrap';

const Profile = () => {
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );

  return <Col></Col>;
};

export { Profile };
