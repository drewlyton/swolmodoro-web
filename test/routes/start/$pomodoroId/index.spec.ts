import { truncateDB } from "@/test/helpers/truncateDB";
import { db } from "~/db.server";
import { loader as indexLoader } from "~/routes/start/$pomodoroId/index";

beforeEach(async () => {
  await truncateDB();
});

describe("$pomodoroId", () => {
  describe("index loader", () => {
    it("redirects to next active timer", async () => {
      const pomodoro = await db.pomodoro.create({ data: {} });
      await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 10, status: "FINISHED" },
      });
      const timer2 = await db.timer.create({
        data: { pomodoroId: pomodoro.id, length: 10 },
      });
      const response: Response = await indexLoader({
        request: new Request(`/start/${pomodoro.id}`, {}),
        params: { pomodoroId: pomodoro.id },
        context: {},
      });
      expect(response).toRedirectTo(`/start/${pomodoro.id}/${timer2.id}`);
    });

    it("redirects to start if no next active timer", async () => {
      const pomodoro = await db.pomodoro.create({ data: {} });
      const response: Response = await indexLoader({
        request: new Request(`/start/${pomodoro.id}`, {}),
        params: { pomodoroId: pomodoro.id },
        context: {},
      });
      expect(response).toRedirectTo("/start");
    });
  });
});
