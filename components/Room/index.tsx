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

let peers = [];

export const Room: React.FC<RoomProps> = ({ title }) => {
    const router = useRouter();
    const user = useSelector(selectUserData);
    const [users, setUsers] = React.useState<UserData[]>([]);
    const roomId = router.query.id;
    const socket = useSocket();

    useEffect(() => {
        if (typeof window !== 'undefined') {
          // Create call initiator, create connect
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
            })
            .then((stream) => {
              // Tell all users about my connecting in room
              socket.emit('CLIENT@ROOMS/:CALL', {
                user,
                roomId,
              });

              socket.on('SERVER@ROOMS/:JOIN', (allUsers: UserData[]) => {
                // Update users list after connect new user
                console.log(' allUsers :', allUsers);
                // Save users list to state
                setUsers(allUsers);

                allUsers.forEach((speaker) => {
                  // If my id not equal connect user id and if there isn't user in peers array =>
                  // create new peer for this user
                  if (user.id !== speaker.id && !peers.find((obj) => obj.id !== speaker.id)) {
                    const peerIncome = new Peer({
                      initiator: true,
                      trickle: false,
                      stream,
                    });
                    // Get signal from ICE-server and ask all call me
                    peerIncome.on('signal', (signal) => {
                      console.log(signal, 222);
                      console.log('1. Created signal. Answer user' + speaker.fullname + 'call us');
                      // callerUserId = It's me
                      socket.emit('CLIENT@ROOMS/:CALL', {
                        targetUserId: speaker.id,
                        callerUserId: user.id,
                        roomId,
                        signal,
                      });
                      // Save connect in array where id = user id who connect with me
                      peers.push({
                        peer: peerIncome,
                        id: speaker.id,
                      });
                    });
                    // IF CALL ME
                    socket.on('CLIENT@ROOMS/:CALL', ({ targetUserId, callerUserId, signal: callerSignal }) => {
                        console.log('2. User' + callerUserId + 'connect. We can call him.');
                        // Listener connection
                        const peerOutcome = new Peer({
                          initiator: false, // I recipient this sound - listener
                          trickle: false,
                          stream,
                        });
                        // Call
                        peerOutcome.signal(callerUserId);

                        peerOutcome
                          // Get signal from ICE-server and send user
                          .on('signal', (outSignal) => {
                            console.log('3. Get our signal and sent answer for user' + callerUserId);

                            socket.emit('CLIENT@ROOMS:ANSWER', {
                              targetUserId: callerUserId,
                              callerUserId: targetUserId,
                              roomId,
                              signal: outSignal,
                            });
                          })
                          // If ask for my call I'm listening
                          .on('stream', (stream) => {
                            document.querySelector('audio').srcObject = stream;
                            document.querySelector('audio').play();
                          });
                      }
                    );
                    // ANSWER FOR MY CALL
                    socket.on('SERVER@ROOMS:ANSWER', ({ callerUserId, signal }) => {
                      const obj = peers.find((obj) => Number(obj.id) === Number(callerUserId));
                      // Is there somebody who ask to answer us?
                      if (obj) {
                        obj.peer.signal(signal);
                      }
                      console.log('4. We ask user', callerUserId);
                    });
                  }
                });
              });
              // If user left room destroy peer
              socket.on('SERVER@ROOMS:LEAVE', (leaveUser: UserData) => {
                setUsers((prev) => prev.filter((prevUser) => {
                  const peerUser = peers.find((obj) => Number(obj.id) === Number(leaveUser.id));
                  if (peerUser) {
                    peerUser.peer.destroy();
                  }
                  return prevUser.id !== leaveUser.id;
                }));
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
  }
;
