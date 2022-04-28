import { CountdownTimer, timerString } from "./timer";

describe("timeString helper", () => {
  it("timerString(0) should return zero string", () => {
    expect(timerString(0)).toEqual("00:00");
  });
});

describe("CountdownTimer class", () => {
  it("can construct CountdownTimer", () => {
    expect(new CountdownTimer(10)).toBeInstanceOf(CountdownTimer);
  });

  it("displays correct timeString", () => {
    const countdown = new CountdownTimer(25 * 60);
    expect(countdown.countdownString()).toEqual("25:00");
  });

  it("displays correct timeString after decrement", () => {
    vi.useFakeTimers();
    const countdown = new CountdownTimer(25 * 60);
    vi.advanceTimersByTime(1000);
    expect(countdown.countdownString()).toEqual("24:59");
    vi.useRealTimers();
  });
});
