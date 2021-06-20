import { GetServerSidePropsContext } from 'next';
import Cookies from 'nookies';
import axios from 'axios';
import { UserApiS } from './UserApiS';
import { RoomApi } from './RoomApi';

type ApiReturnType = ReturnType<typeof UserApiS> & ReturnType<typeof RoomApi>

export const Api = (ctx: GetServerSidePropsContext): ApiReturnType => {
  const cookies = Cookies.get(ctx);
  const token = cookies.token;

  const instance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: 'Bearer' + token,
    }
  });

  return [UserApiS, RoomApi].reduce((prev, f) => ({ ...prev, ...f(instance) }), {} as ApiReturnType);
};
