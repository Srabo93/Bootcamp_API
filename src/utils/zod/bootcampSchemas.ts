import { z } from "zod";

export const byIdBootcampScheme = z.object({
  params: z.object({
    id: z.string({
      required_error: "Bootcamp id is required",
    }).trim().max(256),
  }),
});

export const createBootcampScheme = z.object({
  user: z.object({
    id: z.string({ required_error: "User id required" }).trim().max(256),
  }),
  body: z.object({
    name: z.string({ required_error: "Bootcmap Name required" }).trim().max(
      256,
    ),
    description: z.string({ required_error: "Bootcamp description required" })
      .trim().max(256),
    website: z.string({ required_error: "Bootcamp description required" })
      .trim().max(256),
    phone: z.string({ required_error: "Phone number required" })
      .trim().max(256),
    address: z.string({ required_error: "Bootcamp address required" })
      .trim().max(256),
    careers: z.string().array().min(1).max(10).nonempty({
      message: "Careers cant be empty",
    }),
    housing: z.boolean(),
    jobAssistance: z.boolean(),
    jobGuarantee: z.boolean(),
    acceptGi: z.boolean(),
  }),
});

export const updateBootcampScheme = z.object({
  params: z.object({
    id: z.string({ required_error: "Bootcamp id required" }).trim().max(256),
  }),
  body: z.object({
    name: z.string({ required_error: "Bootcmap Name required" }).trim().max(
      256,
    ),
    description: z.string({ required_error: "Bootcamp description required" })
      .trim().max(256),
    website: z.string({ required_error: "Bootcamp description required" })
      .trim().max(256),
    phone: z.string({ required_error: "Phone number required" })
      .trim().max(256),
    address: z.string({ required_error: "Bootcamp address required" })
      .trim().max(256),
    careers: z.string().array().min(1).max(10).nonempty({
      message: "Careers cant be empty",
    }),
    housing: z.boolean(),
    jobAssistance: z.boolean(),
    jobGuarantee: z.boolean(),
    acceptGi: z.boolean(),
  }).optional(),
});

export const deleteBootcampScheme = z.object({
  params: z.object({
    id: z.string({ required_error: "Bootcamp id required" }).trim().max(256),
  }),
});
