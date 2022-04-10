import type { Session, Timer } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Timer } from "@prisma/client";

export function getTimer({
  id,
  sessionId,
}: Pick<Timer, "id"> & {
  sessionId?: Session["id"];
}) {
  return prisma.timer.findFirst({
    where: { id, sessionId },
  });
}

export function getTimerListItems({ sessionId }: { sessionId: Session["id"] }) {
  return prisma.timer.findMany({
    where: { sessionId },
    select: { id: true },
  });
}

export function createTimer({
  length,
  sessionId,
}: Pick<Timer, "length"> & {
  sessionId?: Session["id"];
}) {
  return prisma.timer.create({
    data: {
      length,
      session: {
        connect: {
          id: sessionId,
        },
      },
    },
  });
}

export function deleteTimer({
  id,
  sessionId,
}: Pick<Timer, "id"> & { sessionId: Session["id"] }) {
  return prisma.timer.deleteMany({
    where: { id, sessionId },
  });
}
