import { schema } from "normalizr";

export const userSchema = new schema.Entity("users");

export const projectSchema = new schema.Entity("projects", {
    user: [userSchema],
});

export const bugSchema = new schema.Entity("bugs", {
    project: projectSchema,
});
