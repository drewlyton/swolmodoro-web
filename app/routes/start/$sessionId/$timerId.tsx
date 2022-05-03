import dingSound from "@/public/ding.mp3";
import type { Session, Timer } from "@prisma/client";
import { useCallback, useState } from "react";
import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useLoaderData } from "remix";
import { CountdownClock } from "~/components/CountdownClock/CountdownClock";
import { db } from "~/db.server";
import { useSound } from "~/hooks/useSound";
import { getSession } from "~/models/session.server";
import { getTimer } from "~/models/timer.server";

type LoaderData = {
  session: Session;
  timer: Timer;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.sessionId || !params.timerId)
    throw new Response("sessionId or timerId not found", { status: 404 });

  const session = await getSession({ id: params.sessionId });
  const timer = await getTimer({ id: params.timerId });

  if (!timer || !session)
    throw new Response("session or timer not found", { status: 404 });

  return json<LoaderData>({ session, timer }, 200);
};

export default function () {
  const data = useLoaderData<LoaderData>();

  const [showNext, setShowNext] = useState(false);
  const [ding] = useSound(dingSound);
  const onEnd = useCallback(() => {
    setShowNext(true);
    ding();
  }, [setShowNext, ding]);

  return (
    <div className="my-0 mx-auto flex max-w-md flex-col items-center justify-center">
      <div className="font-nunito text-xs font-bold uppercase text-tomato">
        {data.timer.type} SESSION
      </div>
      <div className="font-nunito text-2xl font-bold uppercase">
        {data.timer.type === "EXERCISE" ? "Back Wall Slides" : "Time To Work"}
      </div>
      <CountdownClock length={data.timer.length} onEnd={onEnd} />
      {showNext && (
        <Form method="post">
          <button name="_action" value={1} type="submit">
            Take A Break
          </button>
          <button name="_action" value={0} type="submit">
            Stay Focused
          </button>
        </Form>
      )}
    </div>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.sessionId || !params.timerId)
    throw new Response("sessionId or timerId not found", { status: 404 });

  const formData = await request.formData();
  const type = formData.get("_action");
  // Set last timer as finished and get the other timers for this sessino
  const lastTimer = await db.timer.update({
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

  if (!lastTimer) throw new Response("Timer not found", { status: 404 });

  const oppositeType = lastTimer.type === "FOCUS" ? "EXERCISE" : "FOCUS";
  const timers = lastTimer.session.timers.filter(
    (x) => x.id !== lastTimer.id || x.status === "ACTIVE"
  );
  const oppositeTimers = timers.filter((x) => x.type === oppositeType);
  const sameTimers = timers.filter((x) => oppositeTimers.includes(x));

  switch (type) {
    case "1":
      console.log("Get opposite Timer type");
      return redirect(`/start/${params.sessionId}/${oppositeTimers[0].id}`);
    case "0":
      console.log("Get next same Timer type");
      return redirect(`/start/${params.sessionId}/${sameTimers[0].id}`);
    default:
  }

  return redirect(`/start/${params.sessionId}/${"hello"}`);
};
