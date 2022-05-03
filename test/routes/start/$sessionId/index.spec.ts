import { truncateDB } from "@/test/helpers/truncateDB";
import { db } from "~/db.server";
import { loader as indexLoader } from "~/routes/start/$sessionId/index";

beforeEach(async () => {
  await truncateDB();
});

describe("$sessionId", () => {
  describe("index loader", () => {
    it("redirects to next active timer", async () => {
      const session = await db.session.create({ data: { name: "hello" } });
      const timer = await db.timer.create({
        data: { sessionId: session.id, length: 10 },
      });
      const response: Response = await indexLoader({
        request: new Request(`/start/${session.id}`, {}),
        params: { sessionId: session.id },
        context: {},
      });
      expect(response).toRedirectTo(`/start/${session.id}/${timer.id}`);
    });

    it("redirects to start if no next active timer", async () => {
      const session = await db.session.create({ data: { name: "hello" } });
      const response: Response = await indexLoader({
        request: new Request(`/start/${session.id}`, {}),
        params: { sessionId: session.id },
        context: {},
      });
      expect(response).toRedirectTo("/start");
    });
  });

  describe("$timerId action", () => {
    test.skip("go to next timer", async () => {
      expect(true).toBeTruthy();
    });
  });
});
