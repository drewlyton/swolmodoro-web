export function timerString(time: number): string {
  if (!time) return "00:00";
  return new Date(time * 1000).toISOString().slice(14, 19);
}

export class CountdownTimer {
  dateComplete = new Date();
  totalTime = 0;

  constructor(secondsUntilDone: number) {
    if (!secondsUntilDone)
      throw new Error(
        "CountdownTimer constructor must specify secondsUntilDone"
      );
    // take timeUntilDone in seconds and figure out date of completed timer
    this.reconstruct(secondsUntilDone);
    this.totalTime = secondsUntilDone * 1000;
  }

  countdownString() {
    if (this.time <= this.baseTime) {
      return zeroString;
    }
    const timeString = new Date(this.timeRemaining).toISOString().slice(14, 19);
    return timeString[0] == "0" ? timeString.slice(1, 5) : timeString;
  }

  percentComplete() {
    return ((this.totalTime - this.timeRemaining) / this.totalTime) * 100;
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
    return Math.round(this.timer.getTime() / 1000) * 1000;
  }

  get baseTime() {
    return Math.round(Date.now() / 1000) * 1000;
  }

  public get timeRemaining() {
    return this.time - this.baseTime;
  }
}

export const zeroString = "0:00";
