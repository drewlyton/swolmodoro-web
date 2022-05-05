import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { CountdownTimer, zeroString } from "~/helpers/timer";

type useTimerObject = {
  countdownString: string;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  percentCompleted: number;
  paused: boolean;
};

type timerState = {
  paused: boolean;
  timer: CountdownTimer;
  timeWhenPaused: number;
  countdownString: string;
  percentComplete: number;
};

type timerAction = {
  event: "tick" | "reset" | "play" | "pause";
};

const timerReducer = (state: timerState, action: timerAction) => {};

export const useTimer = (
  initTime: number,
  onEnd?: () => void
): useTimerObject => {
  const [timer, setTimer] = useState(new CountdownTimer(initTime));
  const [ended, toggleEnded] = useReducer((x) => !x, false);
  /* Control pause/play */
  const [paused, setPaused] = useState(false);
  const [timeWhenPaused, setTimeWhenPaused] = useState(0);

  // When initTime changes, reset the timer to first values.
  useEffect(() => {
    const newTimer = new CountdownTimer(initTime);
    setTimer(newTimer);
    setPaused(false);
    setCountdownString(newTimer.countdownString());
  }, [initTime]);

  const [countdownString, setCountdownString] = useState(
    timer.countdownString()
  );

  const [percentCompleted, setPercentCompleted] = useState(
    timer.percentComplete()
  );

  /* Decrement timer every second and trigger rerender */
  useEffect(() => {
    const tick = setInterval(() => {
      if (!paused) {
        setCountdownString(timer.countdownString());
        setPercentCompleted(timer.percentComplete());
      }
    }, 1000);

    return () => clearInterval(tick);
  });

  useEffect(() => {
    if (countdownString === zeroString) {
      toggleEnded();
    }
  }, [countdownString]);

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
    if (ended) {
      pause();
      if (onEnd) onEnd();
    }
  }, [ended, pause, onEnd]);

  return useMemo(() => {
    return {
      countdownString,
      play,
      pause,
      paused,
      togglePlay,
      percentCompleted,
    };
  }, [countdownString, play, pause, paused, togglePlay, percentCompleted]);
};
