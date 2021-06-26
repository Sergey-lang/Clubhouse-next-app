import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import Head from 'next/head';
import { checkAuth } from '../utils/checkAuth';
import { StartRoomModal } from '../components/StartRoomModal';
import { Api } from '../api';
import { Room } from '../api/RoomApi';
import { GetServerSideProps, NextPage } from 'next';

interface RoomsPageProps {
  rooms: Room[]
}

const RoomsPage: NextPage<RoomsPageProps> = ({ rooms }) => {
  const [visibleModal, setVisibleModal] = useState(false);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Header/>
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button onClick={() => {
            setVisibleModal(true);
          }} color="green">+ Start room</Button>
        </div>
        {
          visibleModal && <StartRoomModal onClose={() => {
            setVisibleModal(true);
          }}/>
        }
        <div className="grid mt-30">
          {
            rooms.map((obj) => (
              <Link href={`/rooms/${obj.id}`} key={obj.id}>
                <a className="d-flex">
                  <ConversationCard
                    title={obj.title}
                    avatars={[]}
                    speakers={obj.speakers}
                    listenersCount={obj.listenersCount}/>
                </a>
              </Link>
            ))
          }
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<RoomsPageProps> = async (ctx) => {
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

    const rooms = await Api(ctx).getRooms();

    return {
      props: {
        rooms,
      }
    };
  } catch (error) {
    console.log('ERROR', error);
    return {
      props: {
        rooms: []
      }
    };
  }
};

export default RoomsPage;
