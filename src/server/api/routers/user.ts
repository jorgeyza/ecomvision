import iso from "iso-3166-1";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
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
});
