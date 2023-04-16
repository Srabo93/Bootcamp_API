import { z } from "zod";

export const byIdCourseScheme = z.object({
  params: z.object({
    id: z.string({
      required_error: "Course id is required",
    }).trim().max(256),
  }),
});

export const addCourseScheme = z.object({
  body: z.object({
    title: z.string({ required_error: "Course Name required" }).trim().max(
      256,
    ),
    description: z.string({ required_error: "Course description required" })
      .trim().max(256),
    weeks: z.number().max(20).min(1),
    tuition: z.number().max(40000).min(1000),
    minimumSkill: z.string({ required_error: "Minimum Skill is required" })
      .trim().max(256),
    scholarshipAvailable: z.boolean(),
  }),
});

export const updateCourseScheme = z.object({
  params: z.object({
    bootcampId: z.string({ required_error: "Bootcamp id not provided" }),
  }),
  user: z.object({
    id: z.string({ required_error: "User id required" }).trim().max(256),
  }),
  body: z.object({
    title: z.string({ required_error: "Course Name required" }).trim().max(
      256,
    ),
    description: z.string({ required_error: "Course description required" })
      .trim().max(256),
    weeks: z.number().max(20).min(1),
    tuition: z.number().max(40000).min(1000),
    minimumSkill: z.string({ required_error: "Minimum Skill is required" })
      .trim().max(256),
    scholarshipAvailable: z.boolean(),
  }).optional(),
});

export const deleteCourseScheme = z.object({
  params: z.object({
    id: z.string({ required_error: "Course id required" }).trim().max(256),
  }),
});
