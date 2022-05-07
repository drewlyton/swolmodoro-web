import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useLoaderData } from "remix";
import { Button } from "~/components/Button";
import { Select } from "~/components/Select";
import { getFromFormData } from "~/helpers/form";
import { createPomodoro } from "~/models/pomodoro.server";
import { createTimer } from "~/models/timer.server";

type LoaderData = {
  exerciseTypes: string[];
};
export const loader: LoaderFunction = async () => {
  return json({ exerciseTypes: ["back", "legs", "chest"] });
};

const focusLengths = [10, 15, 20, 25, 30, 35, 40, 45];

const exerciseLengths = [2, 3, 5, 7, 10];

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h2 className="mb-3 font-nunito text-4xl font-bold">Today,</h2>
      <Form method="post" className="space-y-6">
        <div className="flex items-center space-x-4">
          <div>between</div>{" "}
          <Select name={inputNames.focusAmount} defaultValue={4} required>
            <option value={3} className="text-base">
              three
            </option>
            <option value={4}>four</option>
            <option value={5}>five</option>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <Select name={inputNames.focusLength} defaultValue={25 * 60} required>
            {focusLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minute
              </option>
            ))}
          </Select>
          <div>focus sessions,</div>
        </div>
        <div className="flex items-center">I want to work my</div>
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
          <div>&</div>
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
          <div>for</div>{" "}
          <Select name={inputNames.breakLength} defaultValue={5 * 60} required>
            {exerciseLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minutes
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" name="create-session" className="w-full">
          Start Timer
        </Button>
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
  ];

  const newPomodoro = await createPomodoro({
    // userId: await getUserId(request),
  });

  const timers = [];
  for (let i = 0; i < focusAmount * 2 - 1; i++) {
    const newTimer = await createTimer({
      length: i % 2 == 0 ? focusLength : breakLength,
      pomodoroId: newPomodoro.id,
      type: i % 2 == 0 ? "FOCUS" : "EXERCISE",
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
