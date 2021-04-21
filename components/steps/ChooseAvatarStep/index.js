import React from 'react';
import clsx from 'clsx';
import {WhiteBlock} from '../../WhiteBlock';
import {Button} from '../../Button';
import {StepInfo} from '../../StepInfo';
import {Avatar} from '../../Avatar';

import styles from './ChooseAvatarStep.module.scss';

export const ChooseAvatarStep = () => {

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/celebration.png"
        title={`Okay, ${userData?.fullname}!`}
        description="How’s this photo?"
      />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width="120px" height="120px" src={avatarUrl} letters={avatarLetters} />
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
