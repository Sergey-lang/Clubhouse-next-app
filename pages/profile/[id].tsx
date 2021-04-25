import React from 'react';
import {useRouter} from 'next/router';
import {Profile} from '../../components/Profile';
import {Header} from '../../components/Header';

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl="https://m.media-amazon.com/images/M/MV5BMTg4NTgyOTgyNl5BMl5BanBnXkFtZTcwNDQ4OTEzMw@@._V1_SX1500_CR0"
          fullname="Kuharyonok Sergey"
          username="sergey007"
          about="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
        />
      </div>
    </>
  )
}

export default ProfilePage;
