import { redirect } from "remix";
import type { LoaderFunction } from "remix";
import { getSession } from "~/models/session.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (params.sessionId) await getSession({ id: params.sessionId });
  return redirect(`/start/${params.sessionId}/anotherone`);
};
