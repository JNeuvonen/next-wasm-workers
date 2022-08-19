import { useEffect, useRef, useState } from 'react';
import GameContainer from '../components/GameContainer';

export default function Home() {
  useEffect(() => {}, []);

  return (
    <div>
      <GameContainer width={64} height={64} />
    </div>
  );
}
