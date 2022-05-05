import { redirect, useCatch } from "remix";
import type { LoaderFunction } from "remix";
import { getSession } from "~/models/session.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.sessionId) return redirect("/start");
  const session = await getSession({ id: params.sessionId });
  if (!session) return redirect(`/start`);
  const nextTimer = session.timers.find((x) => x.status === "ACTIVE");
  if (!nextTimer) return redirect("/start");
  // Take user to next active timer
  return redirect(`/start/${session.id}/${nextTimer.id}`);
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
