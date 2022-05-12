import React from "react";
import { useTimer } from "~/hooks/useTimer";
import { Button } from "../Button";
import { PauseIcon } from "./PauseIcon";
import { PlayIcon } from "./PlayIcon";

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
      <div data-testid="countdown-text" className="my-4 text-7xl" role="timer">
        {countdownString}
      </div>
      <div className={"my-5 h-1 w-full rounded-md bg-gray-200"}>
        <div
          className="h-1 rounded-md bg-tomato transition-all"
          style={{ width: `${percentCompleted}%` }}
        ></div>
      </div>
      <Button
        onClick={togglePlay}
        icon
        aria-label={paused ? "Play" : "Pause"}
        data-testid="pauseButton"
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </Button>
      <Button
        onClick={onEnd}
        data-testid="skipButton"
        display="outlined"
        className="mt-2 rounded-none border-0 border-b-2 py-1 px-3 text-sm"
      >
        skip
      </Button>
    </>
  );
};
