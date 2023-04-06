import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllWithUserRole: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { role: "user" },
      select: { password: false },
    });
  }),
});
