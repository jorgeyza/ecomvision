import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const getAllWithPaginationInput = z.object({
  pageSize: z.number(),
  pageIndex: z.number(),
});

export const transactionRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany({});
  }),

  getAllWithPagination: publicProcedure
    .input(getAllWithPaginationInput)
    .query(async ({ ctx, input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;
      const skip = pageIndex * pageSize;
      const take = pageSize;

      const allTransactions = await ctx.prisma.transaction.findMany({
        orderBy: { cost: "asc" },
        skip,
        take,
      });

      const totalRows = await ctx.prisma.transaction.count();
      const pageCount = Math.ceil(totalRows / pageSize);

      return {
        rows: allTransactions,
        pageCount,
      };
    }),
});
