import { Button, Flex } from "@chakra-ui/react";
import { Download } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";

import PageHeadings from "~/components/ui/PageHeadings";

const Dashboard: NextPage = () => {
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
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <PageHeadings title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          columnGap={3}
          backgroundColor="accent-200"
          color="primary-500"
          size="lg"
          fontSize="sm"
        >
          <Download size={20} />
          DOWNLOAD REPORTS
        </Button>
      </Flex>
    </>
  );
};

export default Dashboard;
