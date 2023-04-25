import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const overallStatsRouter = createTRPCRouter({
  getSales: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.overallStats.findFirst();
  }),
  getDashboardStats: publicProcedure.query(async ({ ctx }) => {
    // hardcoded values
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    /* Overall Stats */
    const overallStat = await ctx.prisma.overallStats.findFirst({
      where: { year: currentYear },
    });

    const currentMonthStats = overallStat?.monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = overallStat?.dailyData.find(({ date }) => {
      return date === currentDay;
    });

    if (!overallStat || !currentMonthStats || !todayStats) return undefined;

    /* Recent Transactions */
    const transactions = await ctx.prisma.transaction.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return {
      overallStat,
      totalCustomers: overallStat.totalCustomers,
      yearlyTotalSoldUnits: overallStat.yearlyTotalSoldUnits,
      yearlySalesTotal: overallStat.yearlySalesTotal,
      monthlyData: overallStat.monthlyData,
      salesByCategory: overallStat.salesByCategory,
      currentMonthStats,
      todayStats,
      transactions,
    };
  }),
});
