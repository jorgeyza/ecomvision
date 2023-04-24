import { type Transaction } from "@prisma/client";
import iso from "iso-3166-1";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface MongoID {
  $oid: string;
}

interface MongoDate {
  $date: Date;
}

interface UserWithStats {
  _id: MongoID;
  createdAt: MongoDate;
  updatedAt: MongoDate;
  name: string;
  email: string;
  password: string;
  city: string;
  state: null;
  country: string;
  occupation: string;
  phoneNumber: string;
  role: string;
  transactions: MongoID[];
  affiliateStats: AffiliateStats;
}

interface AffiliateStats {
  _id: MongoID;
  userId: MongoID;
  affiliateSales: MongoID[];
  createdAt: MongoDate;
  updatedAt: MongoDate;
}

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
      const userWithStats = (await ctx.prisma.user.aggregateRaw({
        pipeline: [
          { $match: { _id: { $oid: input.id } } },
          {
            $lookup: {
              from: "AffiliateStat",
              localField: "_id",
              foreignField: "userId",
              as: "affiliateStats",
            },
          },
          { $unwind: "$affiliateStats" },
        ],
      })) as unknown as UserWithStats[];

      const foundUserWithStats = userWithStats[0];
      if (!foundUserWithStats)
        return { user: "User not found", sales: undefined };

      const saleTransactions = await ctx.prisma.$transaction(
        foundUserWithStats.affiliateStats.affiliateSales.map((id) => {
          return ctx.prisma.transaction.findUnique({ where: { id: id.$oid } });
        })
      );

      const filteredSaleTransactions = saleTransactions.filter(
        (transaction) => transaction !== null
      ) as Transaction[];

      return { user: foundUserWithStats, sales: filteredSaleTransactions };
    }),
});
