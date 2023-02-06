import { useState } from 'react';
import { Row, Col, Button, Form } from 'reactstrap';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import * as yup from 'yup';
import CustomInput from '../../components/Input';
import { apiRequest } from '../../utils/apiRequest';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { useNavigate } from 'react-router';

const MealCategorySchema = yup
  .object({
    category: yup.string().max(250, 'Maximum 250 characters').required('This field is required.'),
  })
  .defined();
type MealCategoryType = yup.InferType<typeof MealCategorySchema>;
const initialValues = {
  category: '',
};

const CreateMealCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };

  const onCreate = async (values: MealCategoryType, action: any) => {
    const abortController = new AbortController();
    try {
      enableLoading();
      const response = await apiRequest('/meal/v1/categories', { method: 'POST', body: JSON.stringify(values), signal: abortController.signal });
      const { message } = await response.json();

      if (message) {
        if (Array.isArray(message)) {
          message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
        } else {
          toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        }
        abortController.abort();
      } else {
        toastr.success('Success', 'Meal category created!', { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        navigate(0);
      }
    } catch (err) {
      handleError('MEAL_CATEGORY_CREATION', err);
      abortController.abort();
    } finally {
      action.setSubmitting(false);
      disableLoading();
    }
  };

  return (
    <Col xs={12} md={6} lg={4} className="login-page align-items-center justify-content-center align-self-center">
      <Formik initialValues={initialValues} validationSchema={MealCategorySchema} onSubmit={onCreate}>
        {(formik) => (
          <Col className="d-flex flex-column gap-5">
            <Row>
              <h2 className="text-center">Create Category</h2>
            </Row>
            <Row>
              <Form className="d-flex flex-column gap-3">
                <CustomInput
                  label="Category ingredientName"
                  inputProps={{ id: 'category', name: 'category', type: 'text', value: formik.values.category, onChange: formik.handleChange }}
                  error={formik.touched.category && formik.errors.category ? formik.errors.category : ''}
                />
              </Form>
            </Row>
            <Row className="d-flex justify-content-end">
              <Button
                variant="contained"
                color="secondary"
                disabled={formik.isSubmitting || loading}
                className="btn-md"
                onClick={() =>
                  onCreate(formik.values, {
                    setSubmitting: formik.setSubmitting,
                  })
                }
              >
                Create
              </Button>
            </Row>
          </Col>
        )}
      </Formik>
    </Col>
  );
};

export { CreateMealCategory };
