import { truncateDB } from "@/test/helpers/truncateDB";
import { db } from "~/db.server";
import { action as finishedAction } from "~/routes/start/$pomodoroId/$timerId/finished";
import { action as indexAction } from "~/routes/start/$pomodoroId/$timerId/index";

beforeEach(async () => {
  await truncateDB();
});

describe("$timerId", () => {
  describe("index indexAction", () => {
    it("sets timer as FINISHED and redirects to next active timer", async () => {
      const pomodoro = await db.pomodoro.create({ data: {} });
      const timer1 = await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 10 },
      });
      await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 5 },
      });
      const response: Response = await indexAction({
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
      expect(response).toRedirectTo(
        `/start/${pomodoro.id}/${timer1.id}/finished`
      );
    });
  });

  it("sets timer as FINISHED and redirects to finished", async () => {
    const pomodoro = await db.pomodoro.create({ data: {} });
    const timer1 = await db.timer.create({
      data: { pomodoroId: pomodoro.id, length: 10 },
    });
    const response: Response = await indexAction({
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

    expect(response).toRedirectTo(
      `/start/${pomodoro.id}/${timer1.id}/finished`
    );
  });
});

describe("finished indexAction", () => {
  it("should redirect to next timer", async () => {
    const pomodoro = await db.pomodoro.create({ data: {} });
    const timer1 = await db.timer.create({
      data: { pomodoroId: pomodoro.id, length: 10, status: "FINISHED" },
    });
    const timer2 = await db.timer.create({
      data: { pomodoroId: pomodoro.id, length: 5 },
    });
    const response: Response = await finishedAction({
      request: new Request(`/start/${pomodoro.id}/${timer1.id}/finished`, {
        method: "POST",
      }),
      params: { pomodoroId: pomodoro.id, timerId: timer1.id },
      context: {},
    });

    expect(response).toRedirectTo(`/start/${pomodoro.id}/${timer2.id}`);
  });
});
