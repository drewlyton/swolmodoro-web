export function timerString(time: number): string {
  if (!time) return "00:00";
  return new Date(time * 1000).toISOString().slice(14, 19);
}

export class CountdownTimer {
  dateComplete = new Date();

  constructor(secondsUntilDone: number) {
    if (!secondsUntilDone)
      throw new Error(
        "CountdownTimer constructor must specify secondsUntilDone"
      );
    // take timeUntilDone in seconds and figure out date of completed timer
    this.reconstruct(secondsUntilDone);
  }

  countdownString() {
    if (this.time <= this.baseTime) {
      return "00:00";
    }
    return new Date(this.timeRemaining).toISOString().slice(14, 19);
  }

  reconstruct(secondsUntilDone?: number) {
    if (!secondsUntilDone) {
      secondsUntilDone = this.timeRemaining / 1000;
    }
    this.timer = new Date(this.baseTime + secondsUntilDone * 1000);
  }

  set timer(date: Date) {
    this.dateComplete = date;
  }

  get timer() {
    return this.dateComplete;
  }

  get time() {
    return this.timer.getTime();
  }

  get baseTime() {
    return Date.now();
  }

  public get timeRemaining() {
    return this.time - this.baseTime;
  }
}
