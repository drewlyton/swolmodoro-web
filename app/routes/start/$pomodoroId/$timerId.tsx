import type { Pomodoro, Timer } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { TimerTimeline } from "~/components/TimerTimeline";
import { getPomodoro } from "~/models/pomodoro.server";
import { getTimer } from "~/models/timer.server";

type LoaderData = {
  pomodoro: Pomodoro & {
    timers: Timer[];
  };
  timer: Timer;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.pomodoroId || !params.timerId) return redirect("/start");

  const pomodoro = await getPomodoro({ id: params.pomodoroId });
  const timer = await getTimer({ id: params.timerId });

  if (!timer || !pomodoro) return redirect("/start");

  return json<LoaderData>(
    {
      pomodoro,
      timer,
    },
    200
  );
};

export const meta: MetaFunction = ({ data }) => {
  const { timer } = data as LoaderData;
  return {
    charset: "utf-8",
    title: `${timer.type === "EXERCISE" ? "Get movin!" : "Get to work!"}`,
  };
};

export default function () {
  const data = useLoaderData<LoaderData>();

  const exerciseTimers = useMemo(() => {
    return data.pomodoro.timers.filter((timer) => timer.type === "EXERCISE");
  }, [data.pomodoro.timers]);

  const focusTimers = useMemo(() => {
    return data.pomodoro.timers.filter((timer) => timer.type === "FOCUS");
  }, [data.pomodoro.timers]);

  return (
    <>
      <Outlet />
      <div className="mt-6 flex w-full max-w-xs flex-col space-y-2 pb-4">
        <TimerTimeline timers={focusTimers} active={data.timer.id} />
        <TimerTimeline timers={exerciseTimers} active={data.timer.id} />
      </div>
    </>
  );
}
