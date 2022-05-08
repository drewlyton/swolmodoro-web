import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import { getPomodoro } from "~/models/pomodoro.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.pomodoroId) return redirect("/start");
  const pomodoro = await getPomodoro({ id: params.pomodoroId });
  if (!pomodoro) return redirect(`/start`);
  const nextTimer = pomodoro.timers.find((x) => x.status === "ACTIVE");
  if (!nextTimer) return redirect("/start");
  // Take user to next active timer
  return redirect(`/start/${pomodoro.id}/${nextTimer.id}`);
};

export default function () {
  return <></>;
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
      </head>
      <body>
        <h1>Uh oh!</h1>
        <h2>
          {caught.status} {caught.statusText}
        </h2>
      </body>
    </html>
  );
}
