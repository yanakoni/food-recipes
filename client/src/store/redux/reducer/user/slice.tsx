import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import { initialState } from './initial-state';
import { UserState } from './type';

const cookies = new Cookies();
export const UserSlice = createSlice({
  name: 'User Object',
  initialState,
  reducers: {
    reloadUser: (state: UserState, action: PayloadAction<UserState>) => {
      const { id, username, accessToken, refreshToken } = action.payload;
      return { id, username, accessToken, refreshToken };
    },
    loginReducer: (state: UserState, action: PayloadAction<UserState>) => {
      const { id, username, accessToken, refreshToken } = action.payload;
      console.log(action.payload);
      cookies.set('user', window.btoa(JSON.stringify(action.payload)));
      return { id, username, accessToken, refreshToken };
    },
    updateTokens: (state: UserState, action: PayloadAction<Pick<UserState, 'accessToken' | 'refreshToken'>>) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logoutReducer: (state) => {
      state.id = '';
      state.username = '';
      state.accessToken = '';
      state.refreshToken = '';
      cookies.remove('user');
    },
  },
});
