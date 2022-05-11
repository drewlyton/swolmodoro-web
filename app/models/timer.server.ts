import type { EXERCISE_GROUPS, Pomodoro, Timer } from "@prisma/client";

import { db } from "~/db.server";

export type { Timer } from "@prisma/client";

export function getTimer({
  id,
  pomodoroId,
}: Pick<Timer, "id"> & {
  pomodoroId?: Pomodoro["id"];
}) {
  return db.timer.findFirst({
    where: { id, pomodoroId },
    include: {
      pomodoro: {
        include: {
          timers: true,
        },
      },
    },
  });
}

export function getTimerListItems({
  pomodoroId,
}: {
  pomodoroId: Pomodoro["id"];
}) {
  return db.timer.findMany({
    where: { pomodoroId },
    select: { id: true },
  });
}

export function createTimer({
  length,
  pomodoroId,
  type,
  exerciseGroup,
}: Pick<Timer, "length" | "type"> & {
  pomodoroId?: Pomodoro["id"];
  exerciseGroup?: EXERCISE_GROUPS;
}) {
  return db.timer.create({
    data: {
      length,
      type,
      pomodoro: {
        connect: {
          id: pomodoroId,
        },
      },
      exerciseGroup,
    },
  });
}

export function deleteTimer({
  id,
  pomodoroId,
}: Pick<Timer, "id"> & { pomodoroId: Pomodoro["id"] }) {
  return db.timer.deleteMany({
    where: { id, pomodoroId },
  });
}
