import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  getAllWithPagination: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      take: 250,
    });
  }),
});
