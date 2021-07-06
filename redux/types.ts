import { UserSliceState } from './slices/userSlice';
import { RoomsSliceState } from './slices/roomsSlice';

export type RootState = {
  user: UserSliceState;
  rooms: RoomsSliceState;
}
