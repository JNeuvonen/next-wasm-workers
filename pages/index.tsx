import { useEffect, useRef, useState } from 'react';
import GameContainer from '../components/GameContainer';
import GameControls from '../components/GameControls';

export default function Home() {
  const [width, setWidth] = useState(64);
  const [height, setHeight] = useState(64);

  const handleWidth = (event: Event, newValue: number | number[]) => {
    setWidth(newValue as number);
  };

  const handleHeight = (event: Event, newValue: number | number[]) => {
    setHeight(newValue as number);
  };

  return (
    <div style={{ width: '100%' }}>
      <GameContainer width={width} height={height} />
      <GameControls
        width={width}
        height={height}
        widthChangeHandler={handleWidth}
        heightChangeHandler={handleHeight}
      />
    </div>
  );
}
