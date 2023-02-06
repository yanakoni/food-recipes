import { ToastrState } from 'react-redux-toastr';
import { UserState } from './reducer/user/type';
import { ProductState } from './reducer/product/type';
import { MealsState } from './reducer/meals/type';

interface AppState {
  user: UserState;
  meals: MealsState;
  products: ProductState;
  toastr: ToastrState;
}

export type { AppState };
