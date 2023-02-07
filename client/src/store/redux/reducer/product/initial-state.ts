import { ProductsState } from './type';
import { DEFAULT_LIMIT } from '../../../../utils/constants';

const initialState: ProductsState = {
  currentPage: 0,
  limit: DEFAULT_LIMIT,
};

export { initialState };
