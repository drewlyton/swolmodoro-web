import dingSound from "@/public/whistle.mp3";
import type { Timer } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import type { Exercise } from "contentlayer";
import { useCallback } from "react";
import useSound from "use-sound";
import { CountdownClock } from "~/components/CountdownClock";
import { Logo } from "~/components/Logo";
import { db } from "~/db.server";
import { getRandomExerciseByGroup } from "~/models/exercise.server";
import { getTimer } from "~/models/timer.server";

type LoaderData = {
  timer: Timer;
  exercise: Exercise;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.pomodoroId || !params.timerId) return redirect("/start");

  const timer = await getTimer({ id: params.timerId });

  if (!timer) return redirect("/start");
  const exercise = await getRandomExerciseByGroup(timer.exerciseGroup);

  if (!exercise) return redirect("/start");

  return json<LoaderData>(
    {
      timer,
      exercise,
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

  const submit = useSubmit();
  const [ding] = useSound(dingSound, { volume: 0.5 });
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

  return redirect(`/start/${params.pomodoroId}/${params.timerId}/finished`);
};
