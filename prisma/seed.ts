import { PrismaClient } from "@prisma/client";
import {
  dataAffiliateStat,
  dataOverallStat,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataUser,
} from "./seedData.js";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(
      async (tx) => {
        // Delete all existing records
        await tx.affiliateStat.deleteMany();
        await tx.overallStats.deleteMany();
        await tx.product.deleteMany();
        await tx.productStat.deleteMany();
        await tx.transaction.deleteMany();
        await tx.user.deleteMany();

        // Create new records
        const affiliateStats = await tx.affiliateStat.createMany({
          data: dataAffiliateStat,
        });
        const overallStats = await tx.overallStats.createMany({
          data: dataOverallStat,
        });
        const products = await tx.product.createMany({
          data: dataProduct,
        });
        const productStats = await tx.productStat.createMany({
          data: dataProductStat,
        });
        const transactions = await tx.transaction.createMany({
          data: dataTransaction,
        });
        const users = await tx.user.createMany({ data: dataUser });

        console.log(`Created ${affiliateStats.count} affiliateStats`);
        console.log(`Created ${overallStats.count} overallStats`);
        console.log(`Created ${products.count} products`);
        console.log(`Created ${productStats.count} productStats`);
        console.log(`Created ${transactions.count} transactions`);
        console.log(`Created ${users.count} users`);
      },
      {
        timeout: 30000,
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
