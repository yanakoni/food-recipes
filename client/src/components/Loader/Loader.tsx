import { Col, Spinner } from 'reactstrap';
import './Loader.scss';

const getColSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  switch (size) {
    case 'sm':
      return 12;
    case 'md':
      return 7;
    case 'lg':
      return 5;
    case 'xl':
      return 3;
    default:
      return 12;
  }
};

const Loader = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const colSize = getColSize(size);

  return (
    <Col md={colSize} className="d-flex flex-column align-items-center">
      <Spinner className={`loader-${size} mb-5`} color="secondary" />
      <h4 className="sr-only">Loading...</h4>
    </Col>
  );
};

export { Loader };
