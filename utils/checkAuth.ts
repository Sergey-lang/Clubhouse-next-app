import { AnyAction, Store } from '@reduxjs/toolkit';
import { GetServerSidePropsContext } from 'next';
import { Api } from '../api';
import { UserData } from '../pages';
import { RootState } from '../redux/store';

export const checkAuth = async (ctx: GetServerSidePropsContext & {
  store: Store<RootState, AnyAction>;
}): Promise<UserData | null> => {
  try {
    return await Api(ctx).getMe();
  } catch (error) {
    return null;
  }
};
