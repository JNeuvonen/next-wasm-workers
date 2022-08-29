import React, { useEffect, useState } from 'react';
import SliderWrapper from '../SliderWrapper';
interface GameControlProps {
  width: number;
  height: number;
  widthChangeHandler: any;
  heightChangeHandler: any;
}
const GameControls = (props: GameControlProps) => {
  return (
    <div>
      <SliderWrapper
        value={props.width}
        label="Width"
        setValue={props.widthChangeHandler}
      />

      <SliderWrapper
        value={props.height}
        label="Height"
        setValue={props.heightChangeHandler}
      />
    </div>
  );
};
export default GameControls;
