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
});
