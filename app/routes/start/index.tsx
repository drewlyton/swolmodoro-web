import type { EXERCISE_GROUPS } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useReducer } from "react";
import { Button } from "~/components/Button";
import { Select } from "~/components/Select";
import { Spinner } from "~/components/Spinner";
import { getFromFormData } from "~/helpers/form";
import { getKeyByValue } from "~/helpers/helpers";
import { exerciseTypes } from "~/models/exercise.server";
import { createPomodoro } from "~/models/pomodoro.server";
import { createTimer } from "~/models/timer.server";

type LoaderData = {
  exerciseTypes: string[];
};
export const loader: LoaderFunction = async () => {
  return json({ exerciseTypes });
};

const focusLengths = [10, 15, 20, 25, 30, 35, 40, 45];

const exerciseLengths = [2, 3, 5, 7, 10];

export default function () {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const [timeCalc, dispatch] = useReducer(timeCalcReducer, {
    focusAmount: 4,
    breakLength: 5 * 60,
    focusLength: 25 * 60,
    totalTime: 6900,
  });
  const updateTimeCalc = (e: any) => {
    const inputNameKey = getKeyByValue(inputNames, e.target.name);
    dispatch({ type: inputNameKey, payload: parseInt(e.target.value) });
  };
  return (
    <div>
      <h2 className="mb-7 font-nunito text-5xl font-bold">Today,</h2>
      <Form method="post" className="space-y-6">
        <div className="flex items-center text-2xl">I want to move my</div>
        <div className="flex items-center space-x-4">
          <Select
            name={inputNames.firstExerciseType}
            required
            defaultValue={"legs"}
          >
            {data.exerciseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <div className="text-2xl">&</div>
          <Select
            name={inputNames.secondExerciseType}
            required
            defaultValue={"back"}
          >
            {data.exerciseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-2xl">for</div>{" "}
          <Select
            name={inputNames.breakLength}
            defaultValue={5 * 60}
            required
            onChange={updateTimeCalc}
          >
            {exerciseLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minutes
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-2xl">in-between</div>{" "}
          <Select
            name={inputNames.focusAmount}
            defaultValue={4}
            required
            onChange={updateTimeCalc}
          >
            <option value={3} className="text-base">
              three
            </option>
            <option value={4}>four</option>
            <option value={5}>five</option>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            name={inputNames.focusLength}
            defaultValue={25 * 60}
            required
            onChange={updateTimeCalc}
          >
            {focusLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minute
              </option>
            ))}
          </Select>
          <div className="text-2xl">focus sessions.</div>
        </div>
        <div className="text-center">
          <Button
            type="submit"
            name="create-session"
            className="w-full"
            disabled={!!transition.submission}
          >
            Start Timer
          </Button>
          <small className="text-xs text-gray-500">
            {Math.floor(timeCalc.totalTime / 3600)} hours and{" "}
            {Math.floor((timeCalc.totalTime % 3600) / 60)} minutes
          </small>
        </div>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const focusLength = parseInt(
    getFromFormData(formData, inputNames.focusLength, (25 * 60).toString())
  );
  const focusAmount = parseInt(
    getFromFormData(formData, inputNames.focusAmount, "4")
  );
  const breakLength = parseInt(
    getFromFormData(formData, inputNames.breakLength, "300")
  );
  const exerciseTypes = [
    getFromFormData(formData, inputNames.firstExerciseType, "back"),
    getFromFormData(formData, inputNames.secondExerciseType, "chest"),
  ] as EXERCISE_GROUPS[];

  const newPomodoro = await createPomodoro({
    // userId: await getUserId(request),
  });

  const timers = [];
  for (let i = 0; i < focusAmount * 2 - 1; i++) {
    const newTimer = await createTimer({
      length: i % 2 == 0 ? focusLength : breakLength,
      pomodoroId: newPomodoro.id,
      type: i % 2 == 0 ? "FOCUS" : "EXERCISE",
      exerciseGroup: i % 4 == 1 ? exerciseTypes[0] : exerciseTypes[1],
    });
    timers.push(newTimer.id);
  }

  return redirect(`/start/${newPomodoro.id}/${timers[0]}`);
};

export const inputNames = {
  focusAmount: "focus-amount",
  focusLength: "focus-length",
  breakLength: "break-length",
  firstExerciseType: "first-exercise-type",
  secondExerciseType: "second-exercise-type",
};

type timeCalcAction = {
  type: string;
  payload: number;
};

type timeCalcState = {
  focusAmount: number;
  breakLength: number;
  focusLength: number;
  totalTime: number;
};

const timeCalcReducer = (
  state: timeCalcState,
  action: timeCalcAction
): timeCalcState => {
  let newState = { ...state };
  switch (action.type) {
    case "focusAmount":
      newState = { ...state, focusAmount: action.payload };
      break;
    case "breakLength":
      newState = { ...state, breakLength: action.payload };
      break;
    case "focusLength":
      newState = { ...state, focusLength: action.payload };
      break;
    default:
      return state;
  }
  newState = {
    ...newState,
    totalTime:
      newState.focusLength * newState.focusAmount +
      newState.breakLength * (newState.focusAmount - 1),
  };
  return newState;
};
