import type { User, Pomodoro } from "@prisma/client";

import { db } from "~/db.server";

export type { Pomodoro } from "@prisma/client";

export function getPomodoro({
  id,
  userId,
}: Pick<Pomodoro, "id"> & {
  userId?: User["id"];
}) {
  return db.pomodoro.findFirst({
    where: { id, userId },
    include: {
      timers: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export function getPomodoroListItems({ userId }: { userId: User["id"] }) {
  return db.pomodoro.findMany({
    where: { userId },
    select: { id: true },
  });
}

export function createPomodoro({ userId }: { userId?: User["id"] }) {
  const attachUserId = userId
    ? {
        user: {
          connect: {
            id: userId,
          },
        },
      }
    : {};
  return db.pomodoro.create({
    data: {
      ...attachUserId,
    },
  });
}

export function deletePomodoro({
  id,
  userId,
}: Pick<Pomodoro, "id"> & { userId: User["id"] }) {
  return db.pomodoro.deleteMany({
    where: { id, userId },
  });
}
