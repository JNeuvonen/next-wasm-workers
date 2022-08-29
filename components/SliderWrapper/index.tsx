import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
const SliderWrapper = ({
  label,
  value,
  setValue,
}: {
  label: JSX.Element | string;
  value: number;
  setValue: any;
}) => {
  return (
    <div>
      {label}
      <Slider value={value} onChange={setValue} min={0} max={100} />
    </div>
  );
};
export default SliderWrapper;
