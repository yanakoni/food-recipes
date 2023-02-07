import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initial-state';
import { ProductsState } from './type';

export const ProductsSlice = createSlice({
  name: 'Product Object',
  initialState,
  reducers: {
    setFilterOptions: (state: ProductsState, action: PayloadAction<Partial<ProductsState>>): ProductsState => {
      return { ...state, ...action.payload };
    },
  },
});
