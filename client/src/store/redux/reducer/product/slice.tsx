import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initial-state';
import { ProductState } from './type';

export const ProductSlice = createSlice({
  name: 'Product Object',
  initialState,
  reducers: {
    setFilterOptions: (state: ProductState, action: PayloadAction<Partial<ProductState>>): ProductState => {
      return { ...state, ...action.payload };
    },
  },
});
