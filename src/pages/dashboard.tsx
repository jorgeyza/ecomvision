import { Button, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { DownloadIcon, MailIcon, CalculatorIcon } from "lucide-react";
import { type NextPage } from "next";

import BreakdownChart from "~/components/BreakdownChart";
import OverviewChart from "~/components/OverviewChart";
import StatBox from "~/components/StatBox";
import Loading from "~/components/ui/Loading";

import PageHeadings from "~/components/ui/PageHeadings";
import { api } from "~/utils/api";
import { viewEnum } from "./overview";

const Dashboard: NextPage = () => {
  const {
    data: dashboardStats,
    status,
    error,
  } = api.overallStats.getDashboardStats.useQuery();

  return (
    <>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <PageHeadings title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          columnGap={3}
          backgroundColor="accent-200"
          color="primary-500"
          size="lg"
          fontSize="sm"
        >
          <DownloadIcon size={20} />
          DOWNLOAD REPORTS
        </Button>
      </Flex>
      <Grid
        autoRows="160px"
        templateColumns="repeat(12, 1fr)"
        gap={5}
        width="100%"
      >
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : !dashboardStats ? (
          <p>No data</p>
        ) : (
          <>
            <StatBox
              title="Total Customers"
              value={dashboardStats.totalCustomers}
              increase="+14%"
              description="Since last month"
              icon={<MailIcon size={26} />}
            />
            <StatBox
              title="Sales Today"
              value={dashboardStats.todayStats.totalSales}
              increase="+21%"
              description="Since last month"
              icon={<CalculatorIcon size={26} />}
            />
            <GridItem
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor="background-emphasis"
              p={4}
              borderRadius="md"
            >
              <OverviewChart
                data={dashboardStats.overallStat}
                isDashboard={true}
                view={viewEnum.SALES}
              />
            </GridItem>
          </>
        )}
      </Grid>
      <Heading>SITE UNDER CONSTRUCTION...</Heading>
      <p style={{ fontSize: "24px" }}>Pending</p>
      <ul>
        <li>Dashboard</li>
      </ul>
    </>
  );
};

export default Dashboard;
