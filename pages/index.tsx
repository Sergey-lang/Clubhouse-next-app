import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { GitHubStep } from '../components/steps/GitHubStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';
import React from 'react';
import { checkAuth } from '../helpers/checkAuth';

const stepsComponents = {
  0: WelcomeStep,
  1: GitHubStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

export type UserData = {
  id: number;
  fullname: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string;
  token?: string;
};

type MainContextProps = {
  onNextStep: () => void;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setFieldValue: (field: keyof UserData, value: string) => void;
  step: number;
  userData?: UserData;
};

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

const getUserData = (): UserData | null => {
  try {
    return JSON.parse(window.localStorage.getItem('userData'));
  } catch (error) {
    return null;
  }
};

const getFormStep = (): number => {
  const json = getUserData();
  if (json) {
    if (json.phone) {
      return 5;
    } else {
      return 4;
    }
  }
  return 0;
};

export default function Home() {
  const [step, setStep] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<UserData>();
  const Step = stepsComponents[step];

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const setFieldValue = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const json = getUserData();
      if (json) {
        setUserData(json);
        setStep(getFormStep());
      }
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('userData', userData ? JSON.stringify(userData) : '');
  }, [userData]);

  return (
    <MainContext.Provider value={{ step, onNextStep, setUserData, userData, setFieldValue }}>
      <Step/>
    </MainContext.Provider>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (user) {
      return {
        props: {},
        redirect: {
          destination: '/rooms',
          permanent: false,
        },
      };
    }
  } catch (err) {}

  return { props: {} };
};
