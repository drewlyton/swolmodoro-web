import { render, screen } from "@testing-library/react";
import React from "react";
import { CountdownClock } from "./CountdownClock";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("Renders and counts down", async () => {
  render(<CountdownClock length={10} />);

  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:10");
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:09");
});

test("Doesn't show negative time", async () => {
  render(<CountdownClock length={1} />);
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:00");
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:00");
});

test("Clicking pause/play button should stop/start timer", async () => {
  render(<CountdownClock length={1} />);
  const togglePlay = screen.getByRole("button");
  togglePlay.click();
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:01");
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:01");

  // Clicking button again should resume timer
  togglePlay.click();
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:00");
});
