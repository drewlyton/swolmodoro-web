import { getRedirectURL } from "@/test/helpers/getRedirectURL";
import { truncateDB } from "@/test/helpers/truncateDB";
import { db } from "~/db.server";
import { action } from "~/routes/start/$sessionId/$timerId";

beforeEach(async () => {
  await truncateDB();
});

describe("$timerId", () => {
  describe("action", () => {
    it("sets timer as FINISHED and redirects to next active timer", async () => {
      const session = await db.session.create({ data: { name: "hello" } });
      const timer1 = await db.timer.create({
        data: { sessionId: session.id, length: 10 },
      });
      await db.timer.create({
        data: { sessionId: session.id, length: 5 },
      });
      const response: Response = await action({
        request: new Request(`/start/${session.id}/${timer1.id}`, {
          method: "POST",
        }),
        params: { sessionId: session.id, timerId: timer1.id },
        context: {},
      });
      const updatedTimer1 = await db.timer.findFirst({
        where: { id: timer1.id },
      });
      expect(updatedTimer1?.status).toBe("FINISHED");
      expect(response.status).toBe(302);
    });
  });

  it("sets timer as FINISHED and redirects to start if no next timer", async () => {
    const session = await db.session.create({ data: { name: "hello" } });
    const timer1 = await db.timer.create({
      data: { sessionId: session.id, length: 10 },
    });
    const response: Response = await action({
      request: new Request(`/start/${session.id}/${timer1.id}`, {
        method: "POST",
      }),
      params: { sessionId: session.id, timerId: timer1.id },
      context: {},
    });
    console.log();
    const updatedTimer1 = await db.timer.findFirst({
      where: { id: timer1.id },
    });
    expect(updatedTimer1?.status).toBe("FINISHED");

    expect(response).toRedirectTo(`/start/${session.id}`);
  });
});
