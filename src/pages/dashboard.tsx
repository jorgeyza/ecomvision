import { Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  DownloadIcon,
  MailIcon,
  CalculatorIcon,
  UserPlusIcon,
  ComponentIcon,
} from "lucide-react";
import { type NextPage } from "next";
import { type FilterFn, createColumnHelper } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import BreakdownChart from "~/components/BreakdownChart";
import OverviewChart from "~/components/OverviewChart";
import StatBox from "~/components/StatBox";
import Loading from "~/components/ui/Loading";
import DataGrid from "~/components/DataGrid";

import PageHeadings from "~/components/ui/PageHeadings";
import { api } from "~/utils/api";
import { viewEnum } from "./overview";
import { type Transaction } from "./transactions";

const fuzzyFilter: FilterFn<Transaction> = (
  row,
  columnId,
  value: string,
  addMeta
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("userId", {
    header: "USER ID",
  }),
  columnHelper.accessor("createdAt", {
    header: "CREATED AT",
    cell: (props) => props.getValue().toISOString(),
  }),
  columnHelper.accessor("productsIds", {
    header: "# OF PRODUCTS",
    cell: (props) => props.getValue().length,
    enableSorting: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("cost", {
    header: "COST",
    cell: (props) => {
      const registeredCost = props.getValue();
      return registeredCost
        ? `$ ${registeredCost.toFixed(2)}`
        : "No cost registered";
    },
  }),
];

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
          display={{ base: "none", sm: "inline-flex" }}
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
              gridColumn={{ base: "span 12", md: "span 8" }}
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
            <StatBox
              title="Monthly Sales"
              value={dashboardStats.currentMonthStats.totalSales}
              increase="+5%"
              description="Since last month"
              icon={<UserPlusIcon size={26} />}
            />
            <StatBox
              title="Yearly Sales"
              value={dashboardStats.yearlySalesTotal}
              increase="+43%"
              description="Since last month"
              icon={<ComponentIcon size={26} />}
            />

            <GridItem
              gridColumn={{ base: "span 12", md: "span 8" }}
              gridRow="span 3"
            >
              <DataGrid<Transaction>
                data={dashboardStats.transactions}
                columns={columns}
                filterFn={fuzzyFilter}
                isDashboard
              />
            </GridItem>
            <GridItem
              gridColumn={{ base: "span 12", md: "span 4" }}
              gridRow="span 3"
              backgroundColor="background-emphasis"
              p={6}
              borderRadius="md"
            >
              <Text as="h6" color="accent-100">
                Sales By Category
              </Text>
              <BreakdownChart
                data={dashboardStats.overallStat}
                isDashboard={true}
              />
              <Text px={3} fontSize="sm" color="accent-200" noOfLines={2}>
                Breakdown of real states and information via category for
                revenue made for this year and total sales.
              </Text>
            </GridItem>
          </>
        )}
      </Grid>
    </>
  );
};

export default Dashboard;
