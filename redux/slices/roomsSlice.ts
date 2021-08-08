import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomApi, RoomType } from '../../api/RoomApi';
import { Axios } from '../../core/axios';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '../types';

export type RoomsSliceState = {
  items: Room[];
}

const initialState: RoomsSliceState = {
  items: []
};

export const fetchCreateRoom = createAsyncThunk<Room, { title: string, type: RoomType }>(
  'room/fetchCreateRoom',
  async ({ title, type }) => {
    try {
      const room = await RoomApi(Axios).createRoom({ title, type });
      return room as Room;
    } catch (error) {
      throw Error('Ошибка при создании команты');
    }
  }
);

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.items = action.payload;
    },
    updateRoomSpeakers: (state, action: PayloadAction<Room['speakers']>) => {
      state.items = state.items.map((room) => {
        if(room.id === action.payload[0].roomId) {
          room.speakers = action.payload;
        }
        return room;
      })
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchCreateRoom.fulfilled.type, (state, action: PayloadAction<Room>) => {
        state.items.push(action.payload);
      })
      .addCase(fetchCreateRoom.rejected.type, (state, action: PayloadAction<Room>) => {
        console.error(action);
      })
      .addCase(HYDRATE as any, (state, action: PayloadAction<RootState>) => {
        state.items = action.payload.rooms.items;
      })
});

export const { setRooms } = roomsSlice.actions;
export const roomsReducer = roomsSlice.reducer;
