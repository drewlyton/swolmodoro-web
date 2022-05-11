import { exercises } from "content";
import type { Exercise } from "contentlayer";

export const getRandomExerciseByGroup = (group: string): Exercise[] => {
  return exercises.filter((exercise) => {
    const groups = exercise.groupsArray as String[];
    if (groups.includes(group)) return true;
    return false;
  });
};
