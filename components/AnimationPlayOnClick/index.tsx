import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
const AnimationPlayOnClick = ({
  animJSON,
  width,
  height,
  resetGame,
}: {
  animJSON: object;
  width: number;
  height: number;
  resetGame?: () => void;
}) => {
  const animationContainer = useRef(null);
  const anim: any = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      anim.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animJSON,
      });

      anim.current.onComplete = function (e: any) {
        anim.current.goToAndStop(0, true);
        if (resetGame) {
          resetGame();
        }
      };

      return () => anim.current?.destroy();
    }
  }, []);

  const onClickHandler = () => {
    anim.current.play();
  };

  return (
    <div
      ref={animationContainer}
      style={{ width, height, cursor: 'pointer' }}
      onClick={onClickHandler}
    ></div>
  );
};
export default AnimationPlayOnClick;
