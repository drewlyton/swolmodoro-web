import type { EXERCISE_GROUPS } from "@prisma/client";
import { exercises } from "content";
import type { Exercise } from "contentlayer";
import { getRandomNumber } from "~/helpers/helpers";

export const getRandomExerciseByGroup = async (
  group: EXERCISE_GROUPS
): Promise<Exercise> => {
  const filtered = await getExercisesByGroup(group);

  const indexOfFiltered = getRandomNumber(filtered.length - 1);
  return filtered[indexOfFiltered];
};

export const getExercisesByGroup = async (
  group: EXERCISE_GROUPS
): Promise<Exercise[]> => {
  return exercises.filter((exercise) => {
    const groups = exercise.groupsArray as String[];
    if (groups.includes(group)) return true;
    return false;
  });
};
