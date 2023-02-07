import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Row, Col, Button, Form, Spinner } from 'reactstrap';
import { Formik, FormikTouched, setNestedObjectValues } from 'formik';
import { toastr } from 'react-redux-toastr';
import * as yup from 'yup';
import CustomInput from '../../components/Input';
import { apiRequest } from '../../utils/apiRequest';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { Pages } from '../../enums/pages.enum';

const RegistrationSchema = yup
  .object({
    username: yup.string().max(250, 'Maximum 250 characters').required('This field is required.'),
    password: yup.string().max(50, 'Maximum 50 characters').required('This field is required.'),
    passwordRepeat: yup.string().max(50, 'Maximum 50 characters').required('This field is required.'),
  })
  .defined();
type RegistrationType = yup.InferType<typeof RegistrationSchema>;
const initialValues = {
  username: '',
  password: '',
  passwordRepeat: '',
};

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const enableLoading = () => {
    setLoading(true);
  };
  const disableLoading = () => {
    setLoading(false);
  };

  const onRegistration = async (formik: any) => {
    const abortController = new AbortController();
    try {
      const formikErrors = await formik.validateForm();
      if (Object.keys(formikErrors).length) {
        formik.setTouched(setNestedObjectValues<FormikTouched<RegistrationType>>(formikErrors, true));
        return null;
      }

      const { values }: { values: RegistrationType } = formik;

      enableLoading();
      const response = await apiRequest('/user/sign-up', { method: 'POST', body: JSON.stringify(values), signal: abortController.signal });
      const { message, success } = await response.json();

      if (!success && message) {
        if (Array.isArray(message)) {
          message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
        } else {
          toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        }
        abortController.abort();
      } else {
        toastr.success('Success', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        navigate(Pages.LOGIN);
      }
    } catch (err) {
      handleError('REGISTRATION', err);
      abortController.abort();
    } finally {
      formik.setSubmitting(false);
      disableLoading();
    }
  };

  return (
    <Col xs={12} md={6} lg={4} className="registration-page align-items-center justify-content-center align-self-center">
      <Formik initialValues={initialValues} validationSchema={RegistrationSchema} onSubmit={onRegistration}>
        {(formik) => (
          <Col className="d-flex flex-column gap-5">
            <Row>
              <h2 className="text-center">Sign up</h2>
            </Row>
            <Row>
              <Form className="d-flex flex-column gap-3">
                <CustomInput
                  label="Username"
                  inputProps={{ id: 'username', name: 'username', type: 'text', value: formik.values.username, onChange: formik.handleChange }}
                  error={formik.touched.username && formik.errors.username ? formik.errors.username : ''}
                />
                <CustomInput
                  label="Password"
                  inputProps={{
                    id: 'password',
                    name: 'password',
                    type: showPassword ? 'text' : 'password',
                    value: formik.values.password,
                    onChange: formik.handleChange,
                  }}
                  error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                  showPassword={showPassword}
                  isPassword
                />
                <CustomInput
                  label="Repeat Password"
                  inputProps={{
                    id: 'passwordRepeat',
                    name: 'passwordRepeat',
                    type: showPassword ? 'text' : 'password',
                    value: formik.values.passwordRepeat,
                    onChange: formik.handleChange,
                  }}
                  error={formik.touched.passwordRepeat && formik.errors.passwordRepeat ? formik.errors.passwordRepeat : ''}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                  showPassword={showPassword}
                  isPassword
                />
              </Form>
            </Row>
            <Row>
              <Button variant="contained" color="secondary" disabled={formik.isSubmitting || loading} className="btn-md" onClick={() => onRegistration(formik)}>
                Sign up {formik.isSubmitting || (loading && <Spinner className="loader-sm" color="secondary" />)}
              </Button>
            </Row>
          </Col>
        )}
      </Formik>
    </Col>
  );
};

export { Registration };
