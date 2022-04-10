import type { Session, Timer } from "@prisma/client";
import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import { useTimer } from "~/hooks/useTimer";
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
  const countdown = useTimer(data.timer.length);

  return <div>{countdown}</div>;
}
