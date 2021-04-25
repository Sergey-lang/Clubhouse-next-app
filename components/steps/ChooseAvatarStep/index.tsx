import React from 'react';
import clsx from 'clsx';
import {WhiteBlock} from '../../WhiteBlock';
import {Button} from '../../Button';
import {StepInfo} from '../../StepInfo';
import {Avatar} from '../../Avatar';

import styles from './ChooseAvatarStep.module.scss';
import {MainContext} from '../../../pages';

export const ChooseAvatarStep: React.FC = () => {
  const { onNextStep } = React.useContext(MainContext);
  const [avatarUrl, setAvatarUrl] = React.useState<string>('https://m.media-amazon.com/images/M/MV5BMTg4NTgyOTgyNl5BMl5BanBnXkFtZTcwNDQ4OTEzMw@@._V1_SX1500_CR0')
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChangeImage = (event: Event): void => {
    const file = (event.target as HTMLInputElement).files[0];
    if(file) {
      const imageUrl = URL.createObjectURL(file)
      setAvatarUrl(imageUrl)
    }
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener('change', handleChangeImage);
    }
  }, []);

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/celebration.png"
        title={`Okay, Sergey!`}
        description="How’s this photo?"
      />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width="120px"
                  height="120px"
                  src={avatarUrl} />
        </div>
        <div className="mb-30">
          <label htmlFor="image" className="link cup">
            Choose a different photo
          </label>
        </div>
        <input id="image" ref={inputFileRef} type="file" hidden />
        <Button onClick={onNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
