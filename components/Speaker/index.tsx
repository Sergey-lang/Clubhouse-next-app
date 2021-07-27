import React from 'react';
import { Avatar } from '../Avatar';

export type SpeakerProps = {
  fullname: string;
  avatarUrl: string;
}

export const Speaker: React.FC<SpeakerProps> = ({ fullname, avatarUrl }) => {
  return (
    <div className="d-flex flex-column align-items-center mr-40 mr-40">
      <Avatar src={avatarUrl} width="100px" height="100px"/>
      <div className="mt-10">
        <b>{fullname}</b>
      </div>
    </div>
  );
};
