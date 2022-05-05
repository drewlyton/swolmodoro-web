import type { Timer } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { TimerTimeline } from "./TimerTimeline";

it("Select renders", () => {
  const timers: Pick<Timer, "id" | "status" | "type">[] = [
    { status: "FINISHED", id: "1", type: "EXERCISE" },
    { status: "ACTIVE", id: "2", type: "FOCUS" },
  ];
  render(<TimerTimeline timers={timers} active={timers[1].id}></TimerTimeline>);
  expect(screen.getByTestId("timeline")).toBeTruthy();
});
