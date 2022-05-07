import { truncateDB } from "@/test/helpers/truncateDB";
import { db } from "~/db.server";
import { action } from "~/routes/start/$pomodoroId/$timerId";

beforeEach(async () => {
  await truncateDB();
});

describe("$timerId", () => {
  describe("action", () => {
    it("sets timer as FINISHED and redirects to next active timer", async () => {
      const pomodoro = await db.pomodoro.create({ data: {} });
      const timer1 = await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 10 },
      });
      await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 5 },
      });
      const response: Response = await action({
        request: new Request(`/start/${pomodoro.id}/${timer1.id}`, {
          method: "POST",
        }),
        params: { pomodoroId: pomodoro.id, timerId: timer1.id },
        context: {},
      });
      const updatedTimer1 = await db.timer.findFirst({
        where: { id: timer1.id },
      });
      expect(updatedTimer1?.status).toBe("FINISHED");
      expect(response).toRedirectTo(`/start/${pomodoro.id}`);
    });
  });

  it("sets timer as FINISHED and redirects to start if no next timer", async () => {
    const pomodoro = await db.pomodoro.create({ data: {} });
    const timer1 = await db.timer.create({
      data: { pomodoroId: pomodoro.id, length: 10 },
    });
    const response: Response = await action({
      request: new Request(`/start/${pomodoro.id}/${timer1.id}`, {
        method: "POST",
      }),
      params: { pomodoroId: pomodoro.id, timerId: timer1.id },
      context: {},
    });
    const updatedTimer1 = await db.timer.findFirst({
      where: { id: timer1.id },
    });
    expect(updatedTimer1?.status).toBe("FINISHED");

    expect(response).toRedirectTo(`/start/${pomodoro.id}`);
  });
});
