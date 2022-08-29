import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { setTimeout } from 'timers';
import Dashboard from '../Dashboard';
const GameContainer = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const wasmWorkerRef = useRef<Worker | null>();
  const tickCounter = useRef<number>(0);
  let pauseGame = false;

  useEffect(() => {
    const pre = document.getElementById('game-of-life-canvas');

    const tickCounterDiv = document.getElementById('tick-counter');
    const health = document.getElementById('health');

    wasmWorkerRef.current = new Worker(
      new URL('../../src/wasm.worker.ts', import.meta.url)
    );

    wasmWorkerRef.current.addEventListener('message', (evt) => {
      if (evt.data.type === 'gameStateUpdate') {
        tickCounter.current = tickCounter.current + 1;
        if (pre) {
          pre.textContent = evt.data.data;
        }

        if (tickCounterDiv) {
          tickCounterDiv.textContent = `Round: ${String(tickCounter.current)}`;
        }
      }

      if (evt.data.type === 'cellCountUpdate') {
        if (health) {
          //@ts-ignore
          health.value = (evt.data.data / (width * height)) * 100;
        }
      }
    });

    messageHandler({
      type: 'start',
      height: height,
      width: width,
    });
  }, []);

  useEffect(() => {
    messageHandler({ type: 'reSizeGame', height: height, width: width });
  }, [width, height]);

  const renderLoop = () => {
    if (!pauseGame) {
      messageHandler({ type: 'tick' });

      messageHandler({ type: 'getCellCount' });
      requestAnimationFrame(renderLoop);
    }
  };

  const messageHandler = (params: any) => {
    if (wasmWorkerRef.current) {
      wasmWorkerRef.current.postMessage(params);
    }
  };

  const resetGame = () => {
    messageHandler({
      type: 'start',
      height: height,
      width: width,
    });

    messageHandler({
      type: 'tick',
    });
    messageHandler({ type: 'getCellCount' });

    tickCounter.current = 0;
  };

  const pauseAndPlayGameHandler = () => {
    pauseGame = !pauseGame;
    renderLoop();
  };

  useEffect(() => {
    renderLoop();
  });

  return (
    <div
      style={{
        width: 'max-content',
        margin: '0 auto',
        paddingBottom: '100px',
        paddingTop: '100px',
      }}
    >
      <Dashboard
        pauseAndPlayGameHandler={pauseAndPlayGameHandler}
        resetGame={resetGame}
      />
      <pre id="game-of-life-canvas" style={{ fontSize: 12 }}></pre>
    </div>
  );
};
export default GameContainer;
