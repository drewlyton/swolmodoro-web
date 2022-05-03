import React from "react";
import { useTimer } from "~/hooks/useTimer";
import { Button } from "../Button/Button";

type CountdownClockTypes = {
  length: number;
  onEnd?: () => void;
};

export const CountdownClock: React.FC<CountdownClockTypes> = ({
  length,
  onEnd,
}) => {
  const { paused, countdownString, togglePlay, percentCompleted } = useTimer(
    length,
    onEnd
  );
  return (
    <>
      <div data-testid="countdown-text">{countdownString}</div>
      <progress id="progress-bar" max="100" value={percentCompleted}>
        {percentCompleted}/100
      </progress>
      <Button onClick={togglePlay}>{paused ? "Play" : "Pause"}</Button>
    </>
  );
};
