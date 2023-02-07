import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Pagination, PaginationItem, PaginationLink, Row } from 'reactstrap';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/apiRequest';
import { toastr } from 'react-redux-toastr';
import { TOAST_IMPORTANT_TIME_OUT_MS } from '../../utils/constants';
import { handleError } from '../../utils/handleError';
import { Loader } from '../../components/Loader/Loader';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/redux/interfaces';
import { ProductsSlice } from '../../store';
import { initialState } from '../../store/redux/reducer/meals/initial-state';

type Product = { name: string };

const Products = () => {
  const { currentPage, limit } = useSelector(
    (state: AppState) => ({
      currentPage: state.products.currentPage,
      limit: state.products.limit,
    }),
    shallowEqual
  );
  const { setFilterOptions } = ProductsSlice.actions;
  const dispatch = useDispatch();
  const [ingredients, setIngredients] = useState<Product[]>([]);
  const [currentPagesCount, setPagesCount] = useState<number>(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [mealsLimitDropdownOpen, setMealsLimitDropdownOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    try {
      const fetchIngredients = async () => {
        enableLoadingMeals();

        const response = await apiRequest(`/meal/v1/ingredients?skip=${currentPage * limit}&limit=${limit}`, { signal: abortController.signal });
        const { message, data, count }: { message: string; data: Product[]; count: number } = await response.json();

        if (message) {
          if (Array.isArray(message)) {
            message.forEach((msg) => toastr.error('Error', msg, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS }));
          } else {
            toastr.error('Error', message, { timeOut: TOAST_IMPORTANT_TIME_OUT_MS });
          }
        } else {
          setIngredients(data);
          setPagesCount(Math.ceil(count / limit));
        }
      };

      fetchIngredients();
    } catch (err) {
      handleError('INGREDIENTS', err);
      abortController.abort();
    } finally {
      disableLoadingMeals();
    }

    return () => abortController.abort();
  }, [currentPage, limit]);

  useEffect(() => {
    return () => {
      dispatch(setFilterOptions(initialState));
    };
  }, []);

  const enableLoadingMeals = () => {
    setLoadingProducts(true);
  };
  const disableLoadingMeals = () => {
    setLoadingProducts(false);
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
      <Row className="mb-5">
        <Col>
          {loadingProducts && <Loader size="xl" />}
          {!loadingProducts &&
            ingredients &&
            !!ingredients.length &&
            ingredients.map(({ name }) => (
              <p key={name} className="d-flex flex-column">
                {name}
              </p>
            ))}
        </Col>
      </Row>
      <Row className="justify-content-between">
        <Col>
          <p className="mb-2">Products per page:</p>
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

export { Products };
