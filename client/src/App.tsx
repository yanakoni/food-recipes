import { Suspense, useEffect, lazy, useState } from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { Container, Row } from 'reactstrap';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import { UserSlice } from './store';
import { Pages, ProtectedPages } from './enums/pages.enum';
import './App.scss';

const Registration = lazy(() => import('./pages/Registration'));
const Login = lazy(() => import('./pages/Login'));
const Meals = lazy(() => import('./pages/Meals'));
const Meal = lazy(() => import('./pages/Meal'));
const CreateMealCategory = lazy(() => import('./pages/CreateMealCategory'));
const NotFound = lazy(() => import('./pages/NotFound'));
const cookies = new Cookies();

export default function App() {
  const dispatch = useDispatch();
  const { reloadUser } = UserSlice.actions;
  const [reloaded, setReloaded] = useState(false);

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      try {
        const user = JSON.parse(window.atob(cookies.get('user')));
        dispatch(reloadUser(user));
      } catch (err) {
        console.error("Couldn't parse cookie");
        cookies.remove('user');
      }
      setReloaded(true);
    })();
  }, [cookies]);

  return (
    <div className="root d-flex flex-nowrap">
      <Suspense
        fallback={
          <Row className="align-items-center justify-content-center w-100">
            <Loader size="xl" />
          </Row>
        }
      >
        {reloaded && (
          <BrowserRouter>
            <Container className="h-100 position-relative gx-md-0">
              <Row className="content gx-md-0 align-items-center justify-content-center">
                <Navbar />
                <Routes>
                  <Route path={Pages.REGISTRATION} element={<Registration />} />
                  <Route path={Pages.LOGIN} element={<Login />} />
                  <Route path={Pages.MAIN} element={<Meals />} />
                  <Route path={Pages.MEAL} element={<Meal />} />
                  <Route path={ProtectedPages.CREATE_MEAL_CATEGORY} element={<CreateMealCategory />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Row>
            </Container>
          </BrowserRouter>
        )}
      </Suspense>
    </div>
  );
}
