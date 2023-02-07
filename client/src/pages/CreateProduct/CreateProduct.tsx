import { useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import * as yup from 'yup';
import CustomInput from '../../components/Input';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { useNavigate } from 'react-router';
import { protectedApiRequest } from '../../utils/protectedApiRequest';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/redux/interfaces';
import { UserSlice } from '../../store';

const ProductSchema = yup
  .object({
    name: yup.string().max(250, 'Maximum 250 characters').required('This field is required.'),
  })
  .defined();
type ProductType = yup.InferType<typeof ProductSchema>;
const initialValues = {
  name: '',
};

const CreateProduct = () => {
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const { updateTokens } = UserSlice.actions;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };

  const onCreate = async (values: ProductType, action: any) => {
    const abortController = new AbortController();
    try {
      enableLoading();
      const response = await protectedApiRequest(
        '/meal/v1/ingredient',
        user,
        (accessToken, refreshToken) => dispatch(updateTokens({ accessToken, refreshToken })),
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Access-Token': `Bearer ${user.accessToken}`,
            'Refresh-Token': user.refreshToken,
          },
          signal: abortController.signal,
        }
      );
      const { message } = response;

      if (message) {
        if (Array.isArray(message)) {
          message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
        } else {
          toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        }
        abortController.abort();
      } else {
        toastr.success('Success', 'Product name created!', { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        navigate(0);
      }
    } catch (err) {
      handleError('PRODUCT_CREATION', err);
      abortController.abort();
    } finally {
      action.setSubmitting(false);
      disableLoading();
    }
  };

  return (
    <Col xs={12} md={6} lg={4} className="login-page align-items-center justify-content-center align-self-center">
      <Formik initialValues={initialValues} validationSchema={ProductSchema} onSubmit={onCreate}>
        {(formik) => (
          <Col className="d-flex flex-column gap-5">
            <Row>
              <h2 className="text-center">Create a product</h2>
            </Row>
            <Row>
              <Form className="d-flex flex-column gap-3">
                <CustomInput
                  label="Product name"
                  inputProps={{ id: 'name', name: 'name', type: 'text', value: formik.values.name, onChange: formik.handleChange }}
                  error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                />
              </Form>
            </Row>
            <Row className="d-flex justify-content-center">
              <Col xs={6} md={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={formik.isSubmitting || loading}
                  className="w-100 btn-md"
                  onClick={() =>
                    onCreate(formik.values, {
                      setSubmitting: formik.setSubmitting,
                    })
                  }
                >
                  Create
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Formik>
    </Col>
  );
};

export { CreateProduct };
