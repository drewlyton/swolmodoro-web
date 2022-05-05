import dingSound from "@/public/whistle.mp3";
import type { Session, Timer } from "@prisma/client";
import { useCallback, useMemo } from "react";
import type { ActionFunction, LoaderFunction } from "remix";
import { json, redirect, useLoaderData, useSubmit } from "remix";
import { CountdownClock } from "~/components/CountdownClock";
import { Logo } from "~/components/Logo";
import { TimerTimeline } from "~/components/TimerTimeline";
import { db } from "~/db.server";
import { useSound } from "~/hooks/useSound";
import { getSession } from "~/models/session.server";
import { getTimer } from "~/models/timer.server";

type LoaderData = {
  session: Session & {
    timers: Timer[];
  };
  timer: Timer;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.sessionId || !params.timerId)
    throw new Response("sessionId or timerId not found", { status: 404 });

  const session = await getSession({ id: params.sessionId });
  const timer = await getTimer({ id: params.timerId });

  if (!timer || !session)
    throw new Response("session or timer not found", { status: 404 });
  console.log("Timer loader");
  return json<LoaderData>({ session: session, timer }, 200);
};

export default function () {
  const data = useLoaderData<LoaderData>();

  const exerciseTimers = useMemo(() => {
    return data.session.timers.filter((timer) => timer.type === "EXERCISE");
  }, [data.session.timers]);
  const focusTimers = useMemo(() => {
    return data.session.timers.filter((timer) => timer.type === "FOCUS");
  }, [data.session.timers]);

  const submit = useSubmit();
  const [ding] = useSound(dingSound);
  const onEnd = useCallback(() => {
    console.log("onEnd submit");
    submit(null, { method: "post" });
    ding();
  }, [submit, ding]);

  return (
    <>
      <div className="font-nunito text-xs font-bold uppercase text-tomato">
        {data.timer.type} SESSION
      </div>
      <div className="font-nunito text-2xl font-bold uppercase">
        {data.timer.type === "EXERCISE" ? "Back Wall Slides" : "Time To Work"}
      </div>
      <div className="w-2/5 py-7">
        <Logo />
      </div>
      <CountdownClock length={data.timer.length} onEnd={onEnd} />
      <div className="mt-6 flex w-full max-w-xs flex-col space-y-2">
        <TimerTimeline timers={focusTimers} active={data.timer.id} />
        <TimerTimeline timers={exerciseTimers} active={data.timer.id} />
      </div>
    </>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.sessionId || !params.timerId)
    throw new Response("sessionId or timerId not found", { status: 404 });
  // Set last timer as finished and get the other timers for this sessino
  const finishedTimer = await db.timer.update({
    where: {
      id: params.timerId,
    },
    data: {
      status: "FINISHED",
    },
    include: {
      session: {
        include: {
          timers: true,
        },
      },
    },
  });

  if (!finishedTimer) throw new Response("Timer not found", { status: 404 });

  console.log("Redirect to start");
  return redirect(`/start/${params.sessionId}`);
};
