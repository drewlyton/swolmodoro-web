import {
  getExercisesByGroup,
  getRandomExerciseByGroup,
} from "./exercise.server";

test("getRandomExerciseByGroup returns exercise of correct type", async () => {
  expect((await getRandomExerciseByGroup("chest")).groupsArray).toContain(
    "chest"
  );
});

test("getRandomExercisesByGroup returns exercises of correct type", async () => {
  expect((await getExercisesByGroup("chest")).length).toBeGreaterThan(1);
});
