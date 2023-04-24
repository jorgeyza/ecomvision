import iso from "iso-3166-1";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }),
  getAllWithUserRole: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        state: true,
        country: true,
        occupation: true,
        phoneNumber: true,
        role: true,
        transactions: true,
        AffiliateStat: true,
        _count: true,
      },
    });
  }),
  getAllWithAdminRole: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { role: "admin" },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        state: true,
        country: true,
        occupation: true,
        phoneNumber: true,
        role: true,
        transactions: true,
        AffiliateStat: true,
        _count: true,
      },
    });
  }),
  getGeography: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();

    const mappedLocations = users.reduce<Record<string, number>>(
      (acc, { country }) => {
        if (!country) return acc;

        const countryISO3 = iso.whereAlpha2(country);
        if (!countryISO3) return acc;

        const { alpha3 } = countryISO3;

        if (!acc[alpha3]) {
          acc[alpha3] = 0;
        }
        acc[alpha3]++;
        return acc;
      },
      {}
    );

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    return formattedLocations;
  }),
  getUserPerformance: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userWithStats = await ctx.prisma.user.aggregateRaw({
        pipeline: [
          { $match: { _id: input.id } },
          {
            $lookup: {
              from: "affiliatestats",
              localField: "_id",
              foreignField: "userId",
              as: "affiliateStats",
            },
          },
          { $unwind: "$affiliateStats" },
        ],
      });
      console.log(
        "🚀 ~ file: user.ts:91 ~ .query ~ userWithStats:",
        userWithStats
      );

      // const saleTransactions = await Promise.all(
      //   userWithStats[0].affiliateStats.affiliateSales.map((id) => {
      //     return ctx.prisma.transaction.findMany({ where: { id } });
      //   })
      // );
      // console.log(
      //   "🚀 ~ file: user.ts:101 ~ .query ~ saleTransactions:",
      //   saleTransactions
      // );

      // const filteredSaleTransactions = saleTransactions.filter(
      //   (transaction) => transaction !== null
      // );
      // console.log(
      //   "🚀 ~ file: user.ts:105 ~ .query ~ filteredSaleTransactions:",
      //   filteredSaleTransactions
      // );

      // return { user: userWithStats[0], sales: filteredSaleTransactions };
    }),
});
