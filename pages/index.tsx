import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { GitHubStep } from '../components/steps/GitHubStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';
import React from 'react';

const stepsComponents = {
  0: WelcomeStep,
  1: EnterNameStep,
  2: GitHubStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

type MainContextProps = {
  onNextStep: () => void;
  step: number;
}

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

export default function Home() {
  const [step, setStep] = React.useState<number>(3);
  const Step = stepsComponents[step];

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <MainContext.Provider value={{ step, onNextStep }}>
      <Step/>
    </MainContext.Provider>
  );
}
