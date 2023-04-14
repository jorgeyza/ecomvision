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
import { flexRender, type Table } from "@tanstack/react-table";
import { type Dispatch, type SetStateAction } from "react";

import DataGridOptions from "./DataGridOptions";
import TableColumnHeader from "./TableColumnHeader";
import DataGridFooter from "./DataGridFooter";
import FilterPopover from "./FilterPopover";
import VisibilityPopover from "./VisibilityPopover";

interface Props<T extends object> {
  onSetGlobalFilter: Dispatch<SetStateAction<string>>;
  table: Table<T>;
}

const DataGrid = <T extends object>({ table, onSetGlobalFilter }: Props<T>) => {
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

  return (
    <Flex width="100%" flexDirection="column" rowGap={1} position="relative">
      <DataGridOptions
        onSetGlobalFilter={onSetGlobalFilter}
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
