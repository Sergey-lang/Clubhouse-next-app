import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../api/RoomApi';

type RoomsSliceState = {
  items: Room[];
}

const initialState: RoomsSliceState = {
  items: []
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<Room>) => {
      state.items.push(action.payload)
    },
  },
});

export const { addRoom } = roomsSlice.actions;
export const roomsReducer = roomsSlice.reducer;
