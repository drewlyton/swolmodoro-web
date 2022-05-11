import type { EXERCISE_GROUPS } from "@prisma/client";
import { exercises } from "content";
import type { Exercise } from "contentlayer";

export const getRandomExerciseByGroup = async (
  group: EXERCISE_GROUPS
): Promise<Exercise> => {
  const filtered = exercises.filter((exercise) => {
    const groups = exercise.groupsArray as String[];
    if (groups.includes(group)) return true;
    return false;
  });

  const indexOfFiltered = Math.floor(Math.random() * (filtered.length - 1));
  return filtered[indexOfFiltered];
};
