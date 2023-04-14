import { Popover, PopoverBody, PopoverContent, Select } from "@chakra-ui/react";
import { type Table } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useMemo } from "react";

import ColumnFilterInput from "./ColumnFilterInput";
import { selectedTableColumnAtom } from "~/pages/_app";

interface Props<T extends object> {
  isOpenFilterPopover: boolean;
  onCloseFilterPopover: () => void;
  table: Table<T>;
}

const FilterPopover = <T extends object>({
  isOpenFilterPopover,
  onCloseFilterPopover,
  table,
}: Props<T>) => {
  const [selectedTableColumn, setSelectedTableColumn] = useAtom(
    selectedTableColumnAtom
  );
  const column = useMemo(
    () => Boolean(selectedTableColumn) && table.getColumn(selectedTableColumn),
    [selectedTableColumn, table]
  );

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpenFilterPopover}
      onClose={onCloseFilterPopover}
      placement="bottom-start"
      closeOnBlur
    >
      <PopoverContent>
        <PopoverBody
          display="flex"
          flexDirection="column"
          rowGap={4}
          alignItems="end"
        >
          <Select
            size="xs"
            variant="flushed"
            value={selectedTableColumn}
            onChange={(e) => setSelectedTableColumn(e.target.value)}
          >
            {table.getAllLeafColumns().map((column) => {
              const columnHeader = column.columnDef.header as string;
              const columnHeaderId = column.id;
              return (
                <option key={columnHeader} value={columnHeaderId}>
                  {columnHeader}
                </option>
              );
            })}
          </Select>
          {column && <ColumnFilterInput<T> column={column} table={table} />}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
