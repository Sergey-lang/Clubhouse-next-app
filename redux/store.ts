import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { roomsReducer } from './slices/roomsSlice';

const rootReducer = combineReducers({
  rooms: roomsReducer
});

export const makeStore = (): Store =>
  configureStore({
    reducer: roomsReducer
  });
