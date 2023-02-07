import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { toastr } from 'react-redux-toastr';
import { AppState } from '../../store/redux/interfaces';
import { ProductCreationForm } from '../CreateProduct/components/ProductCreationForm';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { UserIngredient } from '../../types/ingredient';
import { handleError } from '../../utils/handleError';
import { protectedApiRequest } from '../../utils/protectedApiRequest';
import { UserSlice } from '../../store';
import './Profile.scss';
import { Loader } from '../../components/Loader/Loader';

const Profile = () => {
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const { updateTokens } = UserSlice.actions;
  const [loadingUserProducts, setLoadingUserProducts] = useState(false);
  const [userProducts, setUserProducts] = useState<UserIngredient[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    try {
      const fetchUserProducts = async () => {
        enableLoadingUserProducts();

        const response = await protectedApiRequest(
          `user/ingredients?username=${user.username}`,
          user,
          (accessToken, refreshToken) => dispatch(updateTokens({ accessToken, refreshToken })),
          {
            headers: {
              'Access-Token': `Bearer ${user.accessToken}`,
              'Refresh-Token': user.refreshToken,
            },
            signal: abortController.signal,
          }
        );
        const { message, data }: { message: string; data: UserIngredient[] } = response;

        if (message) {
          if (Array.isArray(message)) {
            message.forEach((msg) => toastr.info('Info', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
          } else {
            toastr.info('Info', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
          }
        } else {
          setUserProducts(data);
        }
      };

      fetchUserProducts();
    } catch (err) {
      handleError('USER_PRODUCTS', err);
      abortController.abort();
    } finally {
      disableLoadingUserProducts();
    }

    return () => abortController.abort();
  }, []);

  const enableLoadingUserProducts = () => {
    setLoadingUserProducts(true);
  };
  const disableLoadingUserProducts = () => {
    setLoadingUserProducts(false);
  };

  return (
    <Col className="h-100">
      <Row className="mb-5">
        <h3>Your available products (1 unit - 100 grams / milliliters )</h3>
      </Row>
      <Row>
        <h6>Add new product (1 unit - 100 grams / milliliters )</h6>
      </Row>
      <div className="mb-5">
        <ProductCreationForm />
      </div>
      {loadingUserProducts && (
        <Row className="justify-content-center">
          {' '}
          <Loader size="xl" />
        </Row>
      )}
      {!loadingUserProducts && userProducts && !!userProducts.length && userProducts.map((product) => <ProductCreationForm values={product} />)}
    </Col>
  );
};

export { Profile };
