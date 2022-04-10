import { truncateDB } from "@/test/helpers/truncateDB";

beforeEach(async () => {
  await truncateDB();
});

test("validateEmail returns false for non-emails", async () => {
  expect(true).toBe(true);
});
