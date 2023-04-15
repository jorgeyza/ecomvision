# Ecomvision

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ecomvision)

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. Design by [EdRoh](https://www.youtube.com/@EdRohDev)

If you use a local MongoDB replica set, remember to first seed your database `pnpm prisma db seed`

Web app for data visualization with a dashboard, tables and charts generated with Nivo Charts.

This projects has both client-side and server-side pagination for the tables. You can filter tables globally or per column and also sort them.

To start project use `pnpm dev`. You can see the [live application here](https://ecomvision.jorgeyza.com)

## Docker

You can use `docker-compose up` to run a local docker container that has a MongoDB with a replica set already configured if you don't want to provide a Mongo Atlas database. Use the provided connection string `DATABASE_URL_DEV` in `.env.example`

## Envs

- DATABASE_URL => A MongoDB database url (Needs to be a replica set).
- DATABASE_URL_DEV => The DATABASE_URL env you need if you decide to use the provided docker-compose file.

## Stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [ChakraUI](https://chakra-ui.com/)
- [tRPC](https://trpc.io)
- [MongoDB](https://www.mongodb.com/)
