import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import { createColumnHelper, type FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";
import DataGrid from "~/components/DataGrid";

type Customer = RouterOutputs["user"]["getAllWithUserRole"][0];

const fuzzyFilter: FilterFn<Customer> = (
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

const columnHelper = createColumnHelper<Customer>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: "NAME",
  }),
  columnHelper.accessor("email", {
    header: "EMAIL",
  }),
  columnHelper.accessor("phoneNumber", {
    header: "PHONE NUMBER",
    cell: (props) =>
      props.getValue()?.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3"),
  }),
  columnHelper.accessor("country", {
    header: "COUNTRY",
  }),
  columnHelper.accessor("occupation", {
    header: "OCCUPATION",
  }),
  columnHelper.accessor("role", {
    header: "ROLE",
  }),
];

const Customers: NextPage = () => {
  const {
    data: allCustomers = [],
    status,
    error,
  } = api.user.getAllWithUserRole.useQuery();

  return (
    <>
      <PageHeadings title="CUSTOMERS" subtitle="List of customers" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <DataGrid<Customer>
            data={allCustomers}
            columns={columns}
            filterFn={fuzzyFilter}
          />
        )}
      </Flex>
    </>
  );
};

export default Customers;
