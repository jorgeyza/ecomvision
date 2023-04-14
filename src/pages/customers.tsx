import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useState, useEffect } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";
import useDebounce from "~/utils/useDebounce";
import DataGrid from "~/components/DataGrid";

type Customer = RouterOutputs["user"]["getAllWithUserRole"][0];

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});

  const debouncedGlobalFilter = useDebounce<string>(globalFilter, 500);

  const table = useReactTable({
    data: allCustomers,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    table.setPageSize(20);
  }, [table]);

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
            table={table}
            onSetGlobalFilter={setGlobalFilter}
          />
        )}
      </Flex>
    </>
  );
};

export default Customers;
