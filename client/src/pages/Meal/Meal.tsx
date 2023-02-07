import { Col, Row } from 'reactstrap';
import { Meal } from '../../types/meal';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Pages } from '../../enums/pages.enum';
import { Loader } from '../../components/Loader/Loader';
import { apiRequest } from '../../utils/apiRequest';
import { toastr } from 'react-redux-toastr';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { Link } from 'react-router-dom';
import { DeviceType, useDeviceType } from '../../utils/useDeviceType';

const IMG_WIDTH_SM = 300;
const IMG_WIDTH_MD = 400;
const IMG_WIDTH_LG = 500;

const getImgWidth = (deviceType: DeviceType): number => {
  switch (deviceType) {
    case 'mobile':
      return IMG_WIDTH_SM;
    case 'tablet':
      return IMG_WIDTH_MD;
    default:
      return IMG_WIDTH_LG;
  }
};

const MealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deviceType = useDeviceType();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loadingMeal, setLoadingMeal] = useState(false);

  useEffect(() => {
    if (!id || !Number.isInteger(+id)) {
      navigate(Pages.MAIN);
    }

    const abortController = new AbortController();
    try {
      const fetchMeal = async () => {
        enableLoadingMeal();
        const response = await apiRequest(`/meal/${id}`, { signal: abortController.signal });
        const { message, data } = await response.json();

        if (message) {
          if (Array.isArray(message)) {
            message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
          } else {
            toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
          }
        } else {
          setMeal(data);
        }
      };

      fetchMeal();
    } catch (err) {
      handleError('MEAL', err);
      abortController.abort();
    } finally {
      disableLoadingMeal();
    }

    return () => abortController.abort();
  }, [id]);

  const enableLoadingMeal = () => {
    setLoadingMeal(true);
  };
  const disableLoadingMeal = () => {
    setLoadingMeal(false);
  };

  return (
    <Row className="justify-content-center align-items-center">
      {loadingMeal && <Loader size="xl" />}
      {!loadingMeal && !meal && <h2 className="text-center">Meal not found</h2>}
      {!loadingMeal && meal && (
        <Col className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img src={meal.mealThumb} alt={meal.name} width={getImgWidth(deviceType)} />
          </div>
          <Row>
            <h3>{meal.name}</h3>
          </Row>
          <Row>
            <Col className="fw-bold">
              <p>Category: {meal.categoryName}</p>
              <p>Origin: {meal.areaName}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mb-2">{meal.instructions}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <p className="mb-2 fw-bold">Ingredients (1 unit - 100 grams / milliliters ):</p>
              {meal.ingredients?.map((ingredient) => (
                <p key={ingredient.id}>
                  <span>
                    {ingredient.ingredientName}: {ingredient.measure}
                  </span>
                </p>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <span>Source: </span>
                <Link to={meal.recipeSource} rel="noreferrer noopener nofollow" target="_blank" className="text-break">
                  {meal.recipeSource}
                </Link>
              </p>
            </Col>
          </Row>
          {meal.tags && (
            <Row>
              <Col>
                <p>Tags: {meal.tags.map((tag) => `#${tag}`).join(', ')}</p>
              </Col>
            </Row>
          )}
        </Col>
      )}
    </Row>
  );
};

export { MealPage };
