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
      <meter id="fuel" min="0" max="100" value={percentCompleted}>
        at {percentCompleted}/100
      </meter>
      <button onClick={togglePlay}>Pause</button>
    </>
  );
};
