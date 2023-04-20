import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";
import BreakdownChart from "~/components/BreakdownChart";

import { api } from "~/utils/api";

const Overview: NextPage = () => {
  const {
    data: allSales,
    status,
    error,
  } = api.overallStats.getSales.useQuery();

  return (
    <>
      <PageHeadings
        title="BREAKDOWN"
        subtitle="Breakdown of Sales By Category"
      />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <Flex flexDirection="column" height="75vh" width="100%">
            <BreakdownChart data={allSales} isDashboard={false} />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Overview;
