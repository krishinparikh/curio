import { Prisma } from '@prisma/client';

export const updateParentTimestampExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      module: {
        async create({ args, query }) {
          const result = await query(args);

          if (result.courseId) {
            await client.course.update({
              where: { id: result.courseId },
              data: { lastActive: new Date() }
            });
          }

          return result;
        },
        async update({ args, query }) {
          const result = await query(args);

          if (result.courseId) {
            await client.course.update({
              where: { id: result.courseId },
              data: { lastActive: new Date() }
            });
          }

          return result;
        },
        async updateMany({ args, query }) {
          const result = await query(args);

          // For updateMany, courseId might be a string or a filter object
          const courseId = args.where?.courseId;
          if (courseId && typeof courseId === 'string') {
            await client.course.update({
              where: { id: courseId },
              data: { lastUpdated: new Date() }
            });
          }

          return result;
        }
      }
    }
  });
});