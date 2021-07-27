import { AnyAction, Store } from '@reduxjs/toolkit';
import { GetServerSidePropsContext } from 'next';
import { Api } from '../api';
import { UserData } from '../pages';
import { setUserData } from '../redux/slices/userSlice';
import { RootState } from '../redux/types';

export const checkAuth = async (
  ctx: any & {
    store: Store<RootState, AnyAction>;
  },
): Promise<UserData | null> => {
  try {
    const user = await Api(ctx).getMe();
    ctx.store.dispatch(setUserData(user));
    return user;
  } catch (error) {
    return null;
  }
};
