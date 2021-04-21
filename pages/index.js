import Head from 'next/head'
import {WelcomeStep} from '../components/steps/WelcomeStep';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WelcomeStep/>
    </div>
  )
}
