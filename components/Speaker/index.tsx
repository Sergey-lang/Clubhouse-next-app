import Link from 'next/link';
import React from 'react';
import { Avatar } from '../Avatar';

export type SpeakerProps = {
  id: string;
  fullname: string;
  avatarUrl: string;
}

export const Speaker: React.FC<SpeakerProps> = ({ id, fullname, avatarUrl }) => {
  return (
    <Link href={`/profile/${id}`}>
      <a className="d-flex flex-column align-items-center mr-40 mr-40">
        <Avatar src={avatarUrl} width="100px" height="100px"/>
        <div className="mt-10">
          <b>{fullname}</b>
        </div>
      </a>
    </Link>
  );
};
