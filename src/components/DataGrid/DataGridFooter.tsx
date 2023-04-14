import { Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import { type Table } from "@tanstack/react-table";

interface Props<T extends object> {
  table: Table<T>;
}

const pageSizes = [10, 20, 50, 100];

const DataGridFooter = <T extends object>({ table }: Props<T>) => {
  return (
    <Flex justifyContent="end" alignItems="center" columnGap={2}>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </Button>
      <Flex columnGap={2} alignItems="center">
        <Text as="span" fontSize="xs">
          Page
        </Text>
        <Text as="span" fontSize="xs" fontWeight="bold">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Text>
        <Text as="span" fontSize="xs" borderLeft="1px dotted" paddingLeft={2}>
          Go to page:
        </Text>
        <Input
          type="number"
          size="xs"
          maxWidth="40px"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </Flex>
      <Select
        maxWidth="90px"
        size="xs"
        variant="unstyled"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {pageSizes.map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default DataGridFooter;
