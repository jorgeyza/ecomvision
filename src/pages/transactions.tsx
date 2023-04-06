import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import Head from "next/head";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { api } from "~/utils/api";

const Transactions: NextPage = () => {
  const {
    data: allCustomers,
    status,
    error,
  } = api.user.getAllWithUserRole.useQuery();
  console.log("🚀 ~ file: products.tsx:25 ~ allProducts:", allCustomers);
  return (
    <>
      <Head>
        <title>Ecomvision</title>
        <meta
          name="description"
          content="View your data easily in this dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeadings title="CUSTOMERS" subtitle="List of customers" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <p>Here goes the table</p>
        )}
      </Flex>
    </>
  );
};

export default Transactions;
