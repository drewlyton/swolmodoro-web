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
  const { countdownString, togglePlay, percentCompleted } = useTimer(
    length,
    onEnd
  );
  return (
    <>
      <div data-testid="countdown-text">{countdownString}</div>
      <progress id="progress-bar" max="100" value={percentCompleted}>
        {percentCompleted}/100
      </progress>
      <button onClick={togglePlay}>Pause</button>
    </>
  );
};
