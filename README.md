# Ecomvision

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. Design by [EdRoh](https://www.youtube.com/@EdRohDev)

If you use a local MongoDB replica set, remember to first seed your database `pnpm prisma db seed`

To start project use `pnpm dev`.

## Docker

You can use `docker-compose up` to run a local docker container that has a MongoDB with a replica set already configured if you don't want to provide a Mongo Atlas database. Use the provided connection string `DATABASE_URL_DEV` in `.env.example`

## Envs

- DATABASE_URL => A MongoDB database url (Needs to be a replica set).
- DATABASE_URL_DEV => A MongoDB databasase url (Needs to be a replica set). Used for local development. (Remember to replace the environment in `schema.prisma` if you want to use )

## Stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [ChakraUI](https://chakra-ui.com/)
- [tRPC](https://trpc.io)
- [MongoDB](https://www.mongodb.com/)
