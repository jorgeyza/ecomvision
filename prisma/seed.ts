import { PrismaClient, type RoleEnum } from "@prisma/client";
import {
  dataOverallStat,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataAffiliateStat,
  dataUser,
} from "./seedData.json";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(
      async (tx) => {
        // Delete all existing records
        await tx.overallStats.deleteMany();
        await tx.productStat.deleteMany();
        await tx.product.deleteMany();
        await tx.transaction.deleteMany();
        await tx.affiliateStat.deleteMany();
        await tx.user.deleteMany();

        // Create new records
        await tx.overallStats.createMany({ data: dataOverallStat });
        await tx.product.createMany({ data: dataProduct });
        await tx.productStat.createMany({ data: dataProductStat });
        for (const user of dataUser) {
          await tx.user.create({
            data: {
              ...user,
              role: user.role as RoleEnum,
            },
          });
        }
        // Create transactions
        await tx.transaction.createMany({ data: dataTransaction });

        // Create affiliate stats and connect them to the users
        for (const affiliateStatData of dataAffiliateStat) {
          await tx.affiliateStat.create({
            data: {
              id: affiliateStatData.id,
              affiliateSales: {
                connect: affiliateStatData.affiliateSales.map(
                  (transactionId) => ({
                    id: transactionId,
                  })
                ),
              },
              user: { connect: { id: affiliateStatData.userId } },
            },
          });
        }

        console.log(`Created ${dataAffiliateStat.length} affiliateStats`);
        console.log(`Created ${dataOverallStat.length} overallStats`);
        console.log(`Created ${dataProduct.length} products`);
        console.log(`Created ${dataProductStat.length} productStats`);
        console.log(`Created ${dataTransaction.length} transactions`);
        console.log(`Created ${dataUser.length} users`);
      },
      {
        timeout: 120000,
      }
    );
  } catch (error) {
    console.log("🚀 ~ file: seed.ts:55 ~ main ~ error:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
