import { Prisma } from "@prisma/client";

export type CourseWithModules = Prisma.CourseGetPayload<{
  include: { modules: true }
}>;