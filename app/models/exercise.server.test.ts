import { getRandomExerciseByGroup } from "./exercise.server";

test("getRandomExerciseByGroup returns exercise of correct type", async () => {
  expect((await getRandomExerciseByGroup("chest")).groupsArray).toContain(
    "chest"
  );
});
