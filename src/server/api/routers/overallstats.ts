import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const overallStatsRouter = createTRPCRouter({
  getSales: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.overallStats.findFirst();
  }),
});
