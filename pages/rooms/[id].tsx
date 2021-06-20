import React from 'react';
import { Header } from '../../components/Header';
import { BackButton } from '../../components/BackButton';
import { Room } from '../../components/Room';
import { Api } from '../../api';

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
export const getServerSideProps = async (ctx) => {
  try {
    const roomId = ctx.query.id;
    const room = await Api(ctx).getRoom(roomId);

    return {
      props: {
        room,
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
};
