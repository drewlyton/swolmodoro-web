import { render, screen, waitFor } from "@testing-library/react";
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
  expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Play");
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:01");

  // Clicking button again should resume timer
  togglePlay.click();
  vi.advanceTimersByTime(1000);
  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:00");
});

test("Runs onEnd if timer ends", async () => {
  const onEnd = vi.fn();
  render(<CountdownClock length={1} onEnd={onEnd} />);
  vi.advanceTimersByTime(1000);
  await waitFor(() => {
    expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:00");
  });
  expect(onEnd).toBeCalledTimes(1);
});

test("Should restart countdown with new length", async () => {
  const { rerender } = render(<CountdownClock length={1} />);
  vi.advanceTimersByTime(1000);
  rerender(<CountdownClock length={2} />);

  expect(screen.getByTestId("countdown-text")).toHaveTextContent("0:02");
});
