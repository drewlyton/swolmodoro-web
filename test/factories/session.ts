import type { Prisma } from "@prisma/client";
import { db } from "~/db.server";

export const PomodoroFactory = {
  build: (attrs: Partial<Prisma.PomodoroCreateInput> = {}) => {
    return {
      ...attrs,
    } as Prisma.PomodoroCreateInput;
  },
  create: async function (attrs: Partial<Prisma.PomodoroCreateInput> = {}) {
    return await db.pomodoro.create({ data: PomodoroFactory.build(attrs) });
  },
};
