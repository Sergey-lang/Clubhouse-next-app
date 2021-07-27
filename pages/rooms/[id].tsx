import React, { useEffect } from 'react';
import { Header } from '../../components/Header';
import { BackButton } from '../../components/BackButton';
import { Room } from '../../components/Room';
import { Api } from '../../api';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';
import io, { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

const RoomPage: React.FC = ({ room, user }) => {
  const router = useRouter()
  const socketRef = React.useRef<Socket>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3001');

      socketRef.current.emit('CLIENT@ROOMS/JOIN', {
        user,
        roomId: router.query.id
      })

      socketRef.current.on('SERVER@ROOMS:JOIN', user => {
        console.log(user);
      })
    }
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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
