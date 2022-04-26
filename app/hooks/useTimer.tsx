import { useCallback, useEffect, useMemo, useState } from "react";
import { CountdownTimer } from "~/helpers/timer";

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
  const [timer] = useState(new CountdownTimer(initTime));
  const [timeWhenPaused, setTimeWhenPaused] = useState(0);
  const [countdownString, setCountdownString] = useState("");

  /* Decrement timer every second and trigger rerender */
  useEffect(() => {
    const tick = setTimeout(() => {
      console.log("Tick");
      if (!paused) {
        setCountdownString(timer.countdownString());
      }
    }, 1000);

    return () => clearTimeout(tick);
  });

  /* Control pause/play */
  const [paused, setPaused] = useState(false);

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
      setPaused(false);
    } else {
      setTimeWhenPaused(timer.timeRemaining / 1000);
      setPaused(true);
    }
  }, [setPaused, setTimeWhenPaused, paused, timeWhenPaused, timer]);

  return useMemo(() => {
    return {
      countdownString,
      play,
      pause,
      togglePlay,
    };
  }, [countdownString, play, pause, togglePlay]);
};
