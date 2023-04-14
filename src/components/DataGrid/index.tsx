import {
  Flex,
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
  type ColumnDef,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { type RankingInfo } from "@tanstack/match-sorter-utils";
import { useState, useEffect } from "react";

import DataGridOptions from "./DataGridOptions";
import TableColumnHeader from "./TableColumnHeader";
import DataGridFooter from "./DataGridFooter";
import FilterPopover from "./FilterPopover";
import VisibilityPopover from "./VisibilityPopover";

import useDebounce from "~/utils/useDebounce";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface Props<T extends object> {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  filterFn: FilterFn<T>;
}

const DataGrid = <T extends object>({ data, columns, filterFn }: Props<T>) => {
  const {
    isOpen: isOpenVisibilityPopover,
    onToggle: onToggleVisibilityPopover,
    onClose: onCloseVisibilityPopover,
  } = useDisclosure();

  const {
    isOpen: isOpenFilterPopover,
    onToggle: onToggleFilterPopover,
    onClose: onCloseFilterPopover,
  } = useDisclosure();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});

  const debouncedGlobalFilter = useDebounce<string>(globalFilter, 500);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: filterFn,
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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: filterFn,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    table.setPageSize(20);
  }, [table]);

  return (
    <Flex width="100%" flexDirection="column" rowGap={1} position="relative">
      <DataGridOptions
        onSetGlobalFilter={setGlobalFilter}
        onToggleVisibilityPopover={onToggleVisibilityPopover}
      />
      <TableContainer overflowY="auto" maxHeight="75vh">
        <ChakraTable
          variant="simple"
          backgroundColor="background-emphasis"
          fontSize="xs"
        >
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr
                key={headerGroup.id}
                position="sticky"
                top={0}
                left={0}
                backgroundColor="background-emphasis"
              >
                {headerGroup.headers.map((header) => (
                  <TableColumnHeader
                    key={header.id}
                    header={header}
                    onToggleVisibilityPopover={onToggleVisibilityPopover}
                    onToggleFilterPopover={onToggleFilterPopover}
                  />
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody backgroundColor="primary-subtle" overflowY="scroll">
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id} _hover={{ backgroundColor: "whiteAlpha.200" }}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </TableContainer>
      <DataGridFooter<T> table={table} />
      <FilterPopover<T>
        isOpenFilterPopover={isOpenFilterPopover}
        onCloseFilterPopover={onCloseFilterPopover}
        table={table}
      />
      <VisibilityPopover<T>
        isOpenVisibilityPopover={isOpenVisibilityPopover}
        onCloseVisibilityPopover={onCloseVisibilityPopover}
        table={table}
      />
    </Flex>
  );
};

export default DataGrid;
