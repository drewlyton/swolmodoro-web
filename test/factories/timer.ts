import type { Prisma } from "@prisma/client";
import { db } from "~/db.server";
import { SessionFactory } from "./session";

export const TimerFactory = {
  build: (attrs: Partial<Prisma.TimerCreateInput> = {}) => {
    return {
      session: {
        create: SessionFactory.build(),
      },
      ...attrs,
    } as Prisma.TimerCreateInput;
  },
  create: async function (attrs: Partial<Prisma.TimerCreateInput> = {}) {
    return await db.timer.create({ data: TimerFactory.build(attrs) });
  },
};
