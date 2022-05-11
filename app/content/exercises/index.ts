import allExercises from "@/.contentlayer/generated/Exercise/_index.json";
import type { Exercise } from "contentlayer";

export const exercises = allExercises as unknown as Exercise[];
