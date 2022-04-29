import { useCallback, useEffect, useMemo, useState } from "react";
import { CountdownTimer, zeroString } from "~/helpers/timer";

type useTimerObject = {
  countdownString: string;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
};

export const useTimer = (
  initTime: number,
  onEnd?: () => void
): useTimerObject => {
  const [timer, setTimer] = useState(new CountdownTimer(initTime));

  const [countdownString, setCountdownString] = useState(
    timer.countdownString()
  );

  /* Decrement timer every second and trigger rerender */
  useEffect(() => {
    const tick = setTimeout(() => {
      if (!paused) {
        setCountdownString(timer.countdownString());
      }
    }, 1000);

    return () => clearTimeout(tick);
  });

  /* Control pause/play */
  const [paused, setPaused] = useState(false);
  const [timeWhenPaused, setTimeWhenPaused] = useState(0);

  const play = useCallback(() => {
    setPaused(false);
  }, [setPaused]);

  const pause = useCallback(() => {
    setPaused(true);
  }, [setPaused]);

  const togglePlay = useCallback(() => {
    if (paused) {
      // Reconstruct and play
      timer.reconstruct(timeWhenPaused);
      play();
    } else {
      setTimeWhenPaused(timer.timeRemaining / 1000);
      pause();
    }
  }, [pause, play, paused, timeWhenPaused, timer]);

  /* Control timer end */
  useEffect(() => {
    if (countdownString == zeroString) {
      pause();
      if (onEnd) onEnd();
    }
  }, [pause, countdownString, onEnd]);

  // When initTime changes, reset the timer to first values.
  useEffect(() => {
    const newTimer = new CountdownTimer(initTime);
    setTimer(newTimer);
    setPaused(false);
    setCountdownString(newTimer.countdownString());
  }, [initTime]);

  return useMemo(() => {
    return {
      countdownString,
      play,
      pause,
      togglePlay,
    };
  }, [countdownString, play, pause, togglePlay]);
};
