import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { GitHubStep } from '../components/steps/GitHubStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';
import React from 'react';

const stepsComponents = {
  0: WelcomeStep,
  1: GitHubStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

export type UserData = {
  id: number,
  username: string,
  fullname: string,
  avatarUrl: string,
  isActive: number,
  phone: string,
  token?: string,
}

type MainContextProps = {
  onNextStep: () => void;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  setFieldValue: (field: keyof UserData, value: string) => void;
  step: number;
  userData?: UserData;
}

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

export default function Home() {
  const [step, setStep] = React.useState<number>(1);
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

  return (
    <MainContext.Provider value={{ step, onNextStep, setUserData, userData, setFieldValue }}>
      <Step/>
    </MainContext.Provider>
  );
}
