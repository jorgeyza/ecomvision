import { createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "~/server/api/routers/product";
import { userRouter } from "~/server/api/routers/user";
import { transactionRouter } from "./routers/transaction";
import { overallStatsRouter } from "./routers/overallstats";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  user: userRouter,
  transaction: transactionRouter,
  overallStats: overallStatsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
