import type { Prisma } from "@prisma/client";
import { db } from "~/db.server";
import { PomodoroFactory } from "./session";

export const TimerFactory = {
  build: (attrs: Partial<Prisma.TimerCreateInput> = {}) => {
    return {
      pomodoro: {
        create: PomodoroFactory.build(),
      },
      ...attrs,
    } as Prisma.TimerCreateInput;
  },
  create: async function (attrs: Partial<Prisma.TimerCreateInput> = {}) {
    return await db.timer.create({ data: TimerFactory.build(attrs) });
  },
};
