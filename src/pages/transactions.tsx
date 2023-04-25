import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import {
  createColumnHelper,
  type PaginationState,
  type FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useMemo, useState } from "react";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";
import DataGrid from "~/components/DataGrid";

import { type RouterOutputs, api } from "~/utils/api";

export type Transaction = RouterOutputs["transaction"]["getAll"][0];

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

const Transactions: NextPage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const {
    data: allTransactions,
    status,
    error,
  } = api.transaction.getAllWithPagination.useQuery({
    pageIndex,
    pageSize,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  return (
    <>
      <PageHeadings title="TRANSACTIONS" subtitle="List of Transactions" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <DataGrid<Transaction>
            data={allTransactions.rows}
            columns={columns}
            filterFn={fuzzyFilter}
            pagination={pagination}
            onSetPagination={setPagination}
            pageCount={allTransactions.pageCount}
          />
        )}
      </Flex>
    </>
  );
};

export default Transactions;
