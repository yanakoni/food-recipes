import { ToastrState } from 'react-redux-toastr';
import { UserState } from './reducer/user/type';
import { ProductsState } from './reducer/product/type';
import { MealsState } from './reducer/meals/type';

interface AppState {
  user: UserState;
  meals: MealsState;
  products: ProductsState;
  toastr: ToastrState;
}

export type { AppState };
