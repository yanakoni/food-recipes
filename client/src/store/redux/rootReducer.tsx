import { combineReducers } from 'redux';
import { reducer as ToastrReducer } from 'react-redux-toastr';
import { UserReducer, MealsReducer, ProductReducer } from './reducer';

export const rootReducer = combineReducers({
  user: UserReducer,
  meals: MealsReducer,
  products: ProductReducer,
  toastr: ToastrReducer,
});
