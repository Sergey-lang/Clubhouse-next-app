import { RootState } from '../store';

export const selectRooms = (state: RootState) => state.rooms.items;
