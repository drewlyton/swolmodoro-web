import { Form, json, redirect, useLoaderData } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { createSession } from "~/models/session.server";
import { getUserId } from "~/auth.server";
import { createTimer } from "~/models/timer.server";

type LoaderData = {
  exerciseTypes: string[];
};
export const loader: LoaderFunction = async () => {
  return json({ exerciseTypes: ["back", "legs", "chest"] });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const focusLength = formData.get("focus-length");
  if (typeof focusLength !== "string") {
    return json(
      { errors: { "focus-length": "Focus length is required" } },
      { status: 400 }
    );
  }

  const newSession = await createSession({
    name: "hello",
    userId: await getUserId(request),
  });

  const newTimer = await createTimer({
    length: parseInt(focusLength),
    sessionId: newSession.id,
  });

  return redirect(`/start/${newSession.id}/${newTimer.id}`);
};

const focusLengths = [10, 15, 20, 25, 30, 35, 40, 45];

const exerciseLengths = [2, 3, 5, 7, 10];

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h2 className="mb-3 font-nunito text-4xl">Today,</h2>
      <Form method="post">
        <div className="flex items-center">
          <div>between</div>{" "}
          <select name="focus-amount" defaultValue={4}>
            <option value={3}>three</option>
            <option value={4}>four</option>
            <option value={5}>five</option>
          </select>
        </div>
        <div className="flex items-center">
          <select name="focus-length" defaultValue={25 * 60}>
            {focusLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minutes
              </option>
            ))}
          </select>
          <div>focus sessions,</div>
        </div>
        <div className="flex items-center">I want to work my</div>
        <div className="flex items-center">
          <select name="first-exercise">
            {data.exerciseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div>&</div>
          <select name="second-exercise">
            {data.exerciseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <div>for</div>{" "}
          <select name="exercise-length" defaultValue={5 * 60}>
            {exerciseLengths.map((num) => (
              <option key={num} value={num * 60}>
                {num} minutes
              </option>
            ))}
          </select>
        </div>
        <button type="submit" name="create-session">
          Submit
        </button>
      </Form>
    </div>
  );
}
