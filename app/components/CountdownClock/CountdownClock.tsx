import React from "react";
import { useTimer } from "~/hooks/useTimer";
import { Button } from "../Button";

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
      <div data-testid="countdown-text" className="my-6 text-7xl" role="timer">
        {countdownString}
      </div>
      <div className={"my-5 h-1 w-full rounded-md bg-gray-200"}>
        <div
          className="h-1 rounded-md bg-tomato transition-all"
          style={{ width: `${percentCompleted}%` }}
        ></div>
      </div>
      <Button onClick={togglePlay} className="w-full">
        {paused ? "Play" : "Pause"}
      </Button>
    </>
  );
};
