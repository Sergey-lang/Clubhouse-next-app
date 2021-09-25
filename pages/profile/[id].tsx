import React from 'react';
import { Profile } from '../../components/Profile';
import { Header } from '../../components/Header';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';
import { Api } from '../../api';
import { UserData } from '../index';
import { NextPage } from 'next';

interface ProfilePageProps {
  profileData: UserData | null;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ profileData }) => {
  return (
    <>
      <Header/>
      <div className="container mt-30">
        <Profile
          avatarUrl={profileData.avatarUrl}
          fullname={profileData.fullname}
          username={profileData.username}
          about="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
        />
      </div>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    const userId = ctx.query.id;
    const profileData = await Api(ctx).getUserInfo(Number(userId));

    if (!user || !profileData) {
      throw new Error();
    }

    return {
      props: {
        profileData
      },
    };
  } catch (e) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/',
      }
    };
  }
});
