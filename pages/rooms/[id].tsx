import React from 'react';
import { Header } from '../../components/Header';
import { BackButton } from '../../components/BackButton';
import { Room } from '../../components/Room';
import { Api } from '../../api';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';;

const RoomPage: React.FC = ({ room }) => {
  return (
    <>
      <Header/>
      <div className="container mt-40">
        <BackButton title="All rooms" href="/rooms"/>
      </div>
      <Room title={room.title}/>
    </>
  );
};
export default RoomPage;

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const roomId = ctx.query.id;
    const room = await Api(ctx).getRoom(roomId as string);

    return {
      props: {
        room,
        user,
      }
    };
  } catch (e) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/rooms',
      },
    };
  }
});
