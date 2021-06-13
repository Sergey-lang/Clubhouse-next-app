import { GetServerSidePropsContext } from 'next';
import Cookies from 'nookies';
import axios from 'axios';
import { UserApiS } from './UserApiS';

export const Api = (ctx: GetServerSidePropsContext) => {
  const cookies = Cookies.get(ctx);
  const token = cookies.token;

  const instance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: 'Bearer' + token,
    }
  });

  return {
    ...UserApiS(instance)
  };
};
