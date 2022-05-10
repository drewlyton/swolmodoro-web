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
  },
}));

export default makeSource({
  contentDirPath: "./app/content/exercises",
  documentTypes: [Exercise],
});
