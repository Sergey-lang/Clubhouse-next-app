import React from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import Axios from '../core/axios';

const Rooms: React.FC = ({ rooms = [] }) => {

  return (
    <>
      <Header/>
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button color="green">+ Start room</Button>
        </div>
        <div className="grid mt-30">
          {
            rooms.map((obj) => (
              <Link href={`/rooms/${obj.id}`} key={obj.id}>
                <a className="d-flex">
                  <ConversationCard
                    title={obj.title}
                    speakers={obj.guests}
                    avatars={obj.avatars}
                    listenersCount={obj.guestCount}/>
                </a>
              </Link>
            ))
          }
        </div>
      </div>
    </>
  );
};
export default Rooms
export const getServerSideProps = async () => {
  try {
    const { data } = await Axios.get('/rooms.json');
    return {
      props: {
        rooms: data
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
