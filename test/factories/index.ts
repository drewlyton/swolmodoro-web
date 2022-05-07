import { PomodoroFactory } from "./session";
import { TimerFactory } from "./timer";
import { UserFactory } from "./user";

export const Factories: Record<string, any> = {
  Session: PomodoroFactory,
  Timer: TimerFactory,
  User: UserFactory,
};

export type FactoryNames = "Session" | "Timer" | "User";
