import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import Head from 'next/head';
import { checkAuth } from '../utils/checkAuth';
import { StartRoomModal } from '../components/StartRoomModal';

export default function Rooms({ rooms = [] }) {
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
        <StartRoomModal onClose={() => {
          setVisibleModal(true);
        }}/>
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

export const getServerSideProps = async (ctx) => {
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
    return {
      props: {
        user,
        rooms: []
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
