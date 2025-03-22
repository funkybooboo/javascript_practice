import { schema } from "normalizr";

export const projectSchema = new schema.Entity("projects");

export const bugSchema = new schema.Entity("bugs", {
    project: projectSchema,
});
