import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { roomsReducer } from './slices/roomsSlice';
import { createWrapper } from 'next-redux-wrapper';

const rootReducer = combineReducers({
  rooms: roomsReducer
});

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (): Store<RootState> =>
  configureStore({
    reducer: roomsReducer
  });

export const wrapper = createWrapper(makeStore, { debug: true });
