import { combineReducers } from 'redux';
import { reducer as ToastrReducer } from 'react-redux-toastr';
import { UserReducer, MealsReducer, ProductsReducer } from './reducer';

export const rootReducer = combineReducers({
  user: UserReducer,
  meals: MealsReducer,
  products: ProductsReducer,
  toastr: ToastrReducer,
});
