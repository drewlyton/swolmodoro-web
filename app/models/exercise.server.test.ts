import { exercises } from "content";
import { getRandomExerciseByGroup } from "./exercise.server";

test("getRandomExerciseByGroup returns filtered exercises", () => {
  expect(getRandomExerciseByGroup("chest").length).toBeLessThan(
    exercises.length
  );
});
