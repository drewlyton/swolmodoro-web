import React from "react";
import { useTimer } from "~/hooks/useTimer";

type CountdownClockTypes = {
  length: number;
  onEnd?: () => void;
};

export const CountdownClock: React.FC<CountdownClockTypes> = ({
  length,
  onEnd,
}) => {
  const { countdownString, togglePlay } = useTimer(length, onEnd);
  return (
    <>
      <div data-testid="countdown-text">{countdownString}</div>
      <button onClick={togglePlay}>Pause</button>
    </>
  );
};
