import { configureStore, Store } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const store: Store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

//sagaMiddleware.run(rootSaga);
