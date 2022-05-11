import dingSound from "@/public/whistle.mp3";
import type { Pomodoro, Timer } from "@prisma/client";
import { useCallback, useMemo } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { CountdownClock } from "~/components/CountdownClock";
import { Logo } from "~/components/Logo";
import { TimerTimeline } from "~/components/TimerTimeline";
import { db } from "~/db.server";
import { useSound } from "~/hooks/useSound";
import { getPomodoro } from "~/models/pomodoro.server";
import { getTimer } from "~/models/timer.server";
import type { Exercise } from "contentlayer";
import { getRandomExerciseByGroup } from "~/models/exercise.server";

type LoaderData = {
  pomodoro: Pomodoro & {
    timers: Timer[];
  };
  timer: Timer;
  exercise: Exercise;
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
      exercise: await getRandomExerciseByGroup(timer.exerciseGroup),
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

  const submit = useSubmit();
  const [ding] = useSound(dingSound);
  const onEnd = useCallback(() => {
    submit(null, { method: "post" });
    ding();
  }, [submit, ding]);

  return (
    <>
      <div className="font-nunito text-xs font-bold uppercase text-tomato">
        {data.timer.type} SESSION
      </div>
      <div className="font-nunito text-2xl font-bold uppercase">
        {data.timer.type === "EXERCISE" ? data.exercise.name : "Time To Work"}
      </div>
      <div className="w-2/5 py-7">
        <Logo />
      </div>
      <CountdownClock length={data.timer.length} onEnd={onEnd} />
      <div className="mt-6 flex w-full max-w-xs flex-col space-y-2 pb-4">
        <TimerTimeline timers={focusTimers} active={data.timer.id} />
        <TimerTimeline timers={exerciseTimers} active={data.timer.id} />
      </div>
    </>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.pomodoroId || !params.timerId) return redirect("/start");
  // Set last timer as finished and get the other timers for this sessino
  const finishedTimer = await db.timer.update({
    where: {
      id: params.timerId,
    },
    data: {
      status: "FINISHED",
    },
    include: {
      pomodoro: {
        include: {
          timers: true,
        },
      },
    },
  });

  if (!finishedTimer) return redirect("/start");

  return redirect(`/start/${params.pomodoroId}`);
};
