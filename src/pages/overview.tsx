import { Flex, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useState } from "react";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";
import OverviewChart from "~/components/OverviewChart";

import { api } from "~/utils/api";

const viewEnum = {
  UNITS: "units",
  SALES: "sales",
} as const;

type ViewType = (typeof viewEnum)[keyof typeof viewEnum];

const Overview: NextPage = () => {
  const [view, setView] = useState<ViewType>("units");

  const {
    data: allSales,
    status,
    error,
  } = api.overallStats.getSales.useQuery();

  return (
    <>
      <PageHeadings
        title="OVERVIEW"
        subtitle="Overview of general revenue and profit"
      />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <Flex flexDirection="column" height="75vh" width="100%">
            <FormControl sx={{ mt: "1rem" }}>
              <FormLabel>View</FormLabel>
              <Select
                maxWidth="100px"
                value={view}
                onChange={(e) => setView(e.target.value as ViewType)}
              >
                <option value="sales">Sales</option>
                <option value="units">Units</option>
              </Select>
            </FormControl>
            <OverviewChart data={allSales} view={view} />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Overview;
