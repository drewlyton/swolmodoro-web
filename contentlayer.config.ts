import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Exercise = defineDocumentType(() => ({
  name: "Exercise",
  filePathPattern: `**/*.md`,
  fields: {
    name: {
      type: "string",
      description: "The name of the exercise",
      required: true,
    },
    groups: {
      type: "string",
      description: "The muscle groups this exercise works",
      required: true,
    },
  },
  computedFields: {
    groupsArray: {
      type: "list",
      resolve: (exercise) => {
        const groups = exercise.groups as unknown as Record<"name", string>[];
        return groups.map((group) => group.name);
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "./app/content/exercises",
  documentTypes: [Exercise],
});
