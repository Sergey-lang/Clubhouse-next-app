import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Peer from 'simple-peer';
import { Button } from '../Button';

import styles from './Room.module.scss';
import { Speaker } from '../Speaker';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/selectors';
import { UserData } from '../../pages';
import { useSocket } from '../../hooks/useSocket';

interface RoomProps {
  title: string;
}

export const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  const socket = useSocket();

  useEffect(() => {
      if (typeof window !== 'undefined') {
        // Create call initiator, create connect
        navigator.mediaDevices.getUserMedia({
          audio: true
        })
          .then((stream) => {
            const peerIncome = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });
            // Get own signal, notify others users
            peerIncome.on('signal', (signal) => {
              socket.emit('CLIENT@ROOMS/:CALL', {
                user,
                roomId,
                signal,
              });
            });
            // If signal
            socket.on('CLIENT@ROOMS/:CALL', ({ user: callerUser, signal }) => {

              const peerOutcome = new Peer({
                initiator: false,
                trickle: false,
                stream,
              });

              peerOutcome.signal(signal);

              peerOutcome
                .on('stream', (stream) => {
                  document.querySelector('audio').srcObject = stream;
                  document.querySelector('audio').play();
                })
                .on('signal', (signal) => {
                  // transfer our signal for callerUser (who call)
                  socket.emit('CLIENT@ROOMS/:ANSWER', {
                    targetUserId: callerUser.id,
                    roomId,
                    signal,
                  });
                });
            });
            // answer from back-end
            socket.on('CLIENT@ROOMS/:ANSWER', ({ targetUserId, signal }) => {
              if (user.id === targetUserId) {
                peerIncome.signal(signal);
              }
            });
          })
          .catch(() => {
            console.error('Нет доступа к микрофону');
          });


        socket.emit('CLIENT@ROOMS/:JOIN', {
          user,
          roomId,
        });

        socket.on('SERVER@ROOMS:LEAVE', (user: UserData) => {
          setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
        });

        socket.on('SERVER@ROOMS:JOIN', (allUsers) => {
          setUsers(allUsers);
        });

        setUsers((prev) => [...prev, user]);
      }
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <audio src="" controls></audio>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div
          className={clsx('d-flex align-items-center', styles.actionButtons)}
        >
          <Link href="/rooms">
            <a>
              <Button color="gray" className={styles.leaveButton}>
                <img
                  width={18}
                  height={18}
                  src="/static/peace.png"
                  alt="Hand black"
                />
                Leave quietly
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="users">
        {users.map((obj) => (
          <Speaker key={obj.fullname} {...obj} />
        ))}
      </div>
    </div>
  );
};
