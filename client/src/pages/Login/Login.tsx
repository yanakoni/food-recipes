import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Form } from 'reactstrap';
import { Formik } from 'formik';
import { toastr } from 'react-redux-toastr';
import * as yup from 'yup';
import CustomInput from '../../components/Input';
import { apiRequest } from '../../utils/apiRequest';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { ProtectedPages } from '../../enums/pages.enum';
import { UserSlice } from '../../store';
import { AppState } from '../../store/redux/interfaces';

const LoginSchema = yup
  .object({
    username: yup.string().max(250, 'Maximum 250 characters').required('This field is required.'),
    password: yup.string().max(50, 'Maximum 50 characters').required('This field is required.'),
  })
  .defined();
type LoginType = yup.InferType<typeof LoginSchema>;
const initialValues = {
  username: '',
  password: '',
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const { loginReducer } = UserSlice.actions;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(ProtectedPages.PROFILE);
    }
  }, [user]);

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

  const onLogin = async (values: LoginType, action: any) => {
    const abortController = new AbortController();
    try {
      enableLoading();
      const response = await apiRequest('/user/sign-in', { method: 'POST', body: JSON.stringify(values), signal: abortController.signal });
      const { message, id, username, accessToken, refreshToken } = await response.json();
      const user = { id, username, accessToken, refreshToken };

      if (message) {
        if (Array.isArray(message)) {
          message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
        } else {
          toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
        }
        abortController.abort();
      } else {
        dispatch(loginReducer(user));
        navigate(ProtectedPages.PROFILE);
      }
    } catch (err) {
      handleError('LOGIN', err);
      abortController.abort();
    } finally {
      action.setSubmitting(false);
      disableLoading();
    }
  };

  return (
    <Col xs={12} md={6} lg={4} className="login-page align-items-center justify-content-center align-self-center">
      <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={onLogin}>
        {(formik) => (
          <Col className="d-flex flex-column gap-5">
            <Row>
              <h2 className="text-center">Sign in</h2>
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
              </Form>
            </Row>
            <Row className="d-flex justify-content-end">
              <Button
                variant="contained"
                color="secondary"
                disabled={formik.isSubmitting || loading}
                className="btn-md"
                onClick={() =>
                  onLogin(formik.values, {
                    setSubmitting: formik.setSubmitting,
                  })
                }
              >
                Login
              </Button>
            </Row>
          </Col>
        )}
      </Formik>
    </Col>
  );
};

export { Login };
