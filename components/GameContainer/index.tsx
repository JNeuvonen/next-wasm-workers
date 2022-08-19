import React, { useEffect, useRef, useState } from 'react';
const GameContainer = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const wasmWorkerRef = useRef<Worker | null>();
  useEffect(() => {
    const pre = document.getElementById('game-of-life-canvas');
    wasmWorkerRef.current = new Worker(
      new URL('../../src/wasm.worker.ts', import.meta.url)
    );

    wasmWorkerRef.current.addEventListener('message', (evt) => {
      if (evt.data.type === 'gameStateUpdate') {
        if (pre) {
          pre.textContent = evt.data.data;
        }
      }
    });

    wasmWorkerRef.current.postMessage({
      type: 'start',
      height: height,
      width: width,
    });
  }, []);

  const renderLoop = () => {
    if (wasmWorkerRef.current) {
      wasmWorkerRef.current.postMessage({
        type: 'tick',
      });
    }
    requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    renderLoop();
  });

  return (
    <div>
      <pre id="game-of-life-canvas"></pre>
    </div>
  );
};
export default GameContainer;
