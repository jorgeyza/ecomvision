# Ecomvision

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=ecomvision)

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. Design by [EdRoh](https://www.youtube.com/@EdRohDev)

Remember to first seed your database `pnpm prisma db seed`. You need a Mongo database with a replica set or a Mongo Atlas database, which already has a replica set configured.

Web app for data visualization with a dashboard, tables generated with `TanStack Table` and charts generated with `nivo`. Users are able to:

- Easily read the most important data presented in an e-commerce dashboard.
- Benefit from both client-side and server-side pagination for tables, providing efficient data transfer and fast loading times.
- Filter tables globally or per column for easy data exploration and analysis.
- Sort tables for better organization and decision-making.
- Experience a visually appealing, responsive and accessible user interface created using ChakraUI.

To start project use `pnpm dev`. You can see the [live application here](https://ecomvision.jorgeyza.com)

## Docker

You can use `docker-compose up -d` to run a local docker container that has a MongoDB with a replica set already configured if you don't want to provide a Mongo Atlas database. Use the provided connection string `DATABASE_URL_DEV` in `.env.example`

## Envs

- DATABASE_URL => A MongoDB database url (Needs to be a replica set).
- DATABASE_URL_DEV => The DATABASE_URL env you need if you decide to use the provided docker-compose file.

## Stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [ChakraUI](https://chakra-ui.com/)
- [tRPC](https://trpc.io)
- [MongoDB](https://www.mongodb.com/)
- [nivo](https://nivo.rocks/)
- [TanStack Table](https://tanstack.com/table/v8)
