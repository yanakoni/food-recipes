import { ProductState } from './type';
import { DEFAULT_LIMIT } from '../../../../utils/constants';

const initialState: ProductState = {
  currentPage: 0,
  limit: DEFAULT_LIMIT,
};

export { initialState };
