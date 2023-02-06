import { MealsState } from './type';
import { DEFAULT_LIMIT } from '../../../../utils/constants';

const initialState: MealsState = {
  currentPage: 0,
  limit: DEFAULT_LIMIT,
};

export { initialState };
