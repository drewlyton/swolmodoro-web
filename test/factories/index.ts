import { SessionFactory } from "./session";
import { TimerFactory } from "./timer";
import { UserFactory } from "./user";

export const Factories: Record<string, any> = {
  Session: SessionFactory,
  Timer: TimerFactory,
  User: UserFactory,
};

export type FactoryNames = "Session" | "Timer" | "User";
