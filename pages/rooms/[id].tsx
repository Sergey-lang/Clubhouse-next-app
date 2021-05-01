import React from 'react';
import { Header } from '../../components/Header';
import { BackButton } from '../../components/BackButton';
import { Room } from '../../components/Room';
import Axios from '../../core/axios';

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
export default RoomPage
export const getServerSideProps = async (ctx) => {
  try {
    const { data } = await Axios.get('/rooms.json');
    const roomId = ctx.query.id
    const room = data.find((obj) => obj.id === roomId);
    return {
      props: {
        room,
      }
    };
  } catch (e) {
    return {
      props: {
        rooms: []
      }
    };
  }
};
