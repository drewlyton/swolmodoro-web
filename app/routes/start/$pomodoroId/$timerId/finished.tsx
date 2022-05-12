import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Logo } from "~/components/Logo";
import { getPomodoro } from "~/models/pomodoro.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.pomodoroId) return redirect("/start");
  //   const pomodoro = await getPomodoro({ id: params.pomodoroId });
  //   if (!pomodoro) return redirect(`/start`);
  //   const finishedTimer = pomodoro.timers.find((x) => x.status === "ACTIVE");
  //   if (!finishedTimer) return redirect("/start");
  // Take user to next active timer
  return json({});
};

export default function () {
  const submit = useSubmit();
  const onClick = () => {
    submit(null, { method: "post" });
  };
  return (
    <>
      <div className="font-nunito text-xs font-bold uppercase text-tomato">
        SESSION COMPLETE
      </div>
      <div className="font-nunito text-2xl font-bold uppercase">
        Great Work!
      </div>
      <div className="w-2/5 py-7">
        <Logo />
      </div>
      <div
        data-testid="countdown-text"
        className="my-6 text-center font-nunito text-2xl "
        role="timer"
      >
        Ready for next timer?
      </div>
      <Button className="w-full" onClick={onClick}>
        Continue Session
      </Button>
    </>
  );
}

export const action: ActionFunction = async ({ params }) => {
  if (!params.pomodoroId) return redirect("/start");
  const pomodoro = await getPomodoro({ id: params.pomodoroId });
  if (!pomodoro) return redirect(`/start`);
  const nextTimer = pomodoro.timers.find((x) => x.status === "ACTIVE");
  if (!nextTimer) return redirect("/start");
  // Take user to next active timer
  return redirect(`/start/${pomodoro.id}/${nextTimer.id}`);
};
