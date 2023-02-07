import { useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap';
import { Formik, FormikTouched, setNestedObjectValues } from 'formik';
import { toastr } from 'react-redux-toastr';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import CustomInput from '../../../components/Input';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../../utils/constants';
import { handleError } from '../../../utils/handleError';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/redux/interfaces';
import { protectedApiRequest } from '../../../utils/protectedApiRequest';
import { UserSlice } from '../../../store';

const MIN_QUANTITY = 1;

const ProductSchema = yup
  .object({
    ingredientName: yup.string().max(250, 'Maximum 250 characters').required('This field is required.'),
    measure: yup.number().min(MIN_QUANTITY, 'Must be positive').required('This field is required.'),
  })
  .defined();
type ProductType = yup.InferType<typeof ProductSchema>;
const initialValues = {
  ingredientName: '',
  measure: MIN_QUANTITY,
};

const ProductCreationForm = ({ values }: ProductCreationFormType) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateTokens } = UserSlice.actions;
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const [loading, setLoading] = useState(false);

  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };

  const onSubmit = async (formik: any) => {
    const abortController = new AbortController();
    try {
      const formikErrors = await formik.validateForm();
      if (Object.keys(formikErrors).length) {
        formik.setTouched(setNestedObjectValues<FormikTouched<ProductType>>(formikErrors, true));
        return null;
      }

      const { values }: { values: ProductType } = formik;

      enableLoading();
      const response = await protectedApiRequest(
        '/user/ingredient',
        user,
        (accessToken, refreshToken) => dispatch(updateTokens({ accessToken, refreshToken })),
        {
          method: 'POST',
          body: JSON.stringify({ ingredient: values, username: user.username }),
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
      }
      {
        toastr.success('Success', 'Product created!', { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        navigate(0);
      }
    } catch (err) {
      handleError('PRODUCT_CREATION', err);
      abortController.abort();
    } finally {
      formik.setSubmitting(false);
      disableLoading();
    }
  };

  return (
    <Row>
      <Formik initialValues={values ?? initialValues} validationSchema={ProductSchema} onSubmit={onSubmit}>
        {(formik) => (
          <Col>
            <Form>
              <Row className="gap-3 gap-md-0">
                <Col md={4}>
                  <CustomInput
                    label="Product name"
                    inputProps={{
                      id: 'ingredientName',
                      name: 'ingredientName',
                      type: 'text',
                      value: formik.values.ingredientName,
                      onChange: formik.handleChange,
                    }}
                    error={formik.touched.ingredientName && formik.errors.ingredientName ? formik.errors.ingredientName : ''}
                  />
                </Col>
                <Col md={4}>
                  <CustomInput
                    label="Product quantity"
                    inputProps={{
                      id: 'measure',
                      measure: 'name',
                      type: 'number',
                      min: MIN_QUANTITY,
                      value: formik.values.measure,
                      onChange: formik.handleChange,
                    }}
                    error={formik.touched.measure && formik.errors.measure ? formik.errors.measure : ''}
                  />
                </Col>
                <Col md={4} className={`d-flex align-items-end btn-col ${!formik.isValid ? 'has-error' : ''}`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={formik.isSubmitting || loading}
                    className="w-100 btn-md"
                    onClick={() => onSubmit(formik)}
                  >
                    {!values ? 'Create' : 'Update'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        )}
      </Formik>
    </Row>
  );
};

type ProductCreationFormType = {
  values?: ProductType;
};

export { ProductCreationForm };
