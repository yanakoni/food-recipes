import { Pagination, Col, PaginationItem, PaginationLink, Row, DropdownToggle, Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { useEffect, useState } from 'react';
import { Meal } from '../../types/meal';
import { apiRequest } from '../../utils/apiRequest';
import { toastr } from 'react-redux-toastr';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { MealCard } from './components/MealCard';
import { createDynamicPath } from '../../utils/createDynamicPath';
import FilterWithVariants from '../../components/FilterWithVariants';
import { handleError } from '../../utils/handleError';
import { Loader } from '../../components/Loader/Loader';
import './Meals.scss';
import { Pages } from '../../enums/pages.enum';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/redux/interfaces';
import { MealsSlice } from '../../store';
import { initialState } from '../../store/redux/reducer/meals/initial-state';

const Meals = () => {
  const { currentPage, limit } = useSelector(
    (state: AppState) => ({
      currentPage: state.meals.currentPage,
      limit: state.meals.limit,
    }),
    shallowEqual
  );
  const { setFilterOptions } = MealsSlice.actions;
  const dispatch = useDispatch();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [currentPagesCount, setPagesCount] = useState<number>(0);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [mealsLimitDropdownOpen, setMealsLimitDropdownOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    try {
      const fetchMeals = async () => {
        enableLoadingMeals();
        let requestPath = '/meal?';

        if (category) {
          const firstLetter = category.charAt(0);
          const otherLetters = category.substring(1);

          requestPath += `category=${firstLetter.toUpperCase()}${otherLetters.toLowerCase()}&`;
        }

        const response = await apiRequest(`${requestPath}skip=${currentPage * limit}&limit=${limit}`, { signal: abortController.signal });
        const { message, data, count }: { message: string; data: Meal[]; count: number } = await response.json();

        if (message) {
          if (Array.isArray(message)) {
            message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
          } else {
            toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
          }
        } else {
          setMeals(data);
          setPagesCount(Math.ceil(count / limit));
        }
      };

      fetchMeals();
    } catch (err) {
      handleError('MEALS', err);
      abortController.abort();
    } finally {
      disableLoadingMeals();
    }

    return () => abortController.abort();
  }, [category, currentPage, limit]);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      const fetchCategories = async () => {
        enableLoadingCategories();
        const response = await apiRequest('/meal/v1/categories', { signal: abortController.signal });
        const { message, data }: { message: 'string'; data: { name: string }[] } = await response.json();

        if (message) {
          if (Array.isArray(message)) {
            message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
          } else {
            toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
          }
        } else {
          setCategories(data.map(({ name }) => name));
        }
      };

      fetchCategories();
    } catch (err) {
      handleError('CATEGORIES', err);
      abortController.abort();
    } finally {
      disableLoadingCategories();
    }

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setFilterOptions(initialState));
    };
  }, []);

  const enableLoadingMeals = () => {
    setLoadingMeals(true);
  };
  const disableLoadingMeals = () => {
    setLoadingMeals(false);
  };
  const enableLoadingCategories = () => {
    setLoadingCategories(true);
  };
  const disableLoadingCategories = () => {
    setLoadingCategories(false);
  };
  const onCategoryChange = (value: string) => {
    setCategory(value);
  };

  // pagination functions
  const getCanPreviousPage = () => currentPage > 0;
  const previousPage = () => getCanPreviousPage() && dispatch(setFilterOptions({ currentPage: currentPage - 1 }));
  // -1 because pages start from 0
  const getCanNextPage = () => currentPage < currentPagesCount - 1;
  const nextPage = () => getCanNextPage() && dispatch(setFilterOptions({ currentPage: currentPage + 1 }));
  const setToStart = () => getCanPreviousPage() && dispatch(setFilterOptions({ currentPage: 0 }));
  // -1 because currentPages start from 0
  const setToEnd = () => getCanNextPage() && dispatch(setFilterOptions({ currentPage: currentPagesCount - 1 }));
  const toggleMealsLimit = () => setMealsLimitDropdownOpen(!mealsLimitDropdownOpen);

  return (
    <Col>
      <FilterWithVariants
        variants={categories}
        label="Filter by Category"
        inputProps={{
          id: 'category',
          name: 'category',
          type: 'text',
          value: category,
          onChange: ({ target }) => onCategoryChange(target.value),
        }}
        onVariantSelect={onCategoryChange}
        isLoading={loadingCategories}
      />
      <Row>
        {loadingMeals && <Loader size="xl" />}
        {!loadingMeals &&
          meals &&
          !!meals.length &&
          meals.map((meal) => (
            <Col key={meal.id} xs={12} md={6} lg={4} className="d-flex flex-column">
              <Link to={createDynamicPath(Pages.MEAL, [meal.id.toString()])} className="meal-link">
                <MealCard meal={meal} />
              </Link>
            </Col>
          ))}
      </Row>
      <Row className="justify-content-between">
        <Col>
          <p className="mb-2">Meals per page:</p>
          <Dropdown isOpen={mealsLimitDropdownOpen} toggle={toggleMealsLimit}>
            <DropdownToggle caret className="pagination-limit">
              {limit} items
            </DropdownToggle>
            <DropdownMenu>
              {[12, 18, 36, 72, 144].map((val) => (
                <DropdownItem key={val} onClick={() => dispatch(setFilterOptions({ limit: val, currentPage: 0 }))}>
                  {val} items
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col className="d-flex flex-column align-items-end">
          <div>
            <p className="mb-2">Current page: {currentPage + 1}</p>
            <Pagination>
              <PaginationItem onClick={setToStart} disabled={!getCanPreviousPage()}>
                <PaginationLink disabled={!getCanPreviousPage()} first />
              </PaginationItem>
              <PaginationItem onClick={previousPage} disabled={!getCanPreviousPage()}>
                <PaginationLink disabled={!getCanPreviousPage()} previous />
              </PaginationItem>
              <PaginationItem onClick={nextPage} disabled={!getCanNextPage()}>
                <PaginationLink disabled={!getCanNextPage()} next />
              </PaginationItem>
              <PaginationItem onClick={setToEnd} disabled={!getCanNextPage()}>
                <PaginationLink disabled={!getCanNextPage()} last />
              </PaginationItem>
            </Pagination>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export { Meals };
