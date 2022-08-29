import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
import animationJSON from '../../assets/json/icons8-pause.json';
import refreshJSON from '../../assets/json/icons8-refresh (2).json';
import AnimationPlayOnClick from '../AnimationPlayOnClick';
import TooltipWrapper from '../TooltipWrapper';

interface DashBoardTypes {
  pauseAndPlayGameHandler: () => void;
  resetGame: () => void;
}
const Dashboard = (props: DashBoardTypes) => {
  const animationContainer = useRef(null);
  const anim: any = useRef(null);
  useEffect(() => {
    if (animationContainer.current) {
      anim.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationJSON,
      });

      anim.current.onEnterFrame = function (e: any) {
        if (e.currentTime > 17 && e.currentTime < 18 && e.direction === 1) {
          anim.current.stop();
          anim.current.goToAndStop(17, true);
          anim.current.setDirection(-1);
        }

        if (e.currentTime === 0) {
          anim.current.setDirection(1);
        }
      };

      return () => anim.current?.destroy();
    }
  }, []);

  const clickHandler = (e: any) => {
    e.preventDefault();
    anim.current.play();
    props.pauseAndPlayGameHandler();
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div>
        <TooltipWrapper
          title={
            <div style={{ padding: 5, fontSize: 20 }}>Pause or resume</div>
          }
          content={
            <button
              onClick={clickHandler}
              className="pauseAndPlayBtn"
              style={{ marginRight: 5, cursor: 'pointer' }}
            >
              <div
                ref={animationContainer}
                style={{ width: 24, height: 24 }}
              ></div>
            </button>
          }
        />
        <TooltipWrapper
          title={<div style={{ padding: 5, fontSize: 20 }}>Reset the game</div>}
          content={
            <button className="pauseAndPlayBtn">
              <AnimationPlayOnClick
                width={24}
                height={24}
                animJSON={refreshJSON}
                resetGame={props.resetGame}
              />
            </button>
          }
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div id="tick-counter" style={{ fontSize: 18 }}></div>
        </div>
        <TooltipWrapper
          title={
            <div style={{ padding: 5, fontSize: 20 }}>
              Cells alive health bar{' '}
            </div>
          }
          content={
            <progress
              id="health"
              value="15"
              max="100"
              style={{ height: 50, marginTop: -10 }}
            ></progress>
          }
        />
      </div>
    </div>
  );
};
export default Dashboard;
