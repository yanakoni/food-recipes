import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initial-state';
import { MealsState } from './type';

export const MealsSlice = createSlice({
  name: 'Meals Object',
  initialState,
  reducers: {
    setFilterOptions: (state: MealsState, action: PayloadAction<Partial<MealsState>>): MealsState => {
      return { ...state, ...action.payload };
    },
  },
});
