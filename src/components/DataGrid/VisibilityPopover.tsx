import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  Switch,
} from "@chakra-ui/react";
import { type Table } from "@tanstack/react-table";
import { type ReactNode, useState } from "react";

interface Props<T extends object> {
  isOpenVisibilityPopover: boolean;
  onCloseVisibilityPopover: () => void;
  table: Table<T>;
}

const VisibilityPopover = <T extends object>({
  isOpenVisibilityPopover,
  onCloseVisibilityPopover,
  table,
}: Props<T>) => {
  const [popoverSearchedColumn, setPopoverSearchedColumn] = useState("");

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpenVisibilityPopover}
      onClose={onCloseVisibilityPopover}
      placement="bottom-start"
      closeOnBlur
    >
      <PopoverContent>
        <PopoverBody
          display="flex"
          flexDirection="column"
          rowGap={3}
          textTransform="none"
        >
          <Input
            placeholder="Find column"
            size="xs"
            variant="flushed"
            value={popoverSearchedColumn}
            onChange={(e) =>
              setPopoverSearchedColumn(e.target.value.toLowerCase())
            }
          />
          {table
            .getAllLeafColumns()
            .filter((column) => {
              const columnToBeFiltered = column.columnDef.header as string;
              return columnToBeFiltered
                .toLowerCase()
                .includes(popoverSearchedColumn);
            })
            .map((column) => {
              return (
                <FormControl
                  key={column.id}
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                >
                  <Switch
                    id="email-alerts"
                    size="sm"
                    isChecked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  <FormLabel
                    htmlFor="email-alerts"
                    marginBottom={0}
                    fontSize="sm"
                  >
                    {column.columnDef.header as ReactNode}
                  </FormLabel>
                </FormControl>
              );
            })}
          <Button
            variant="ghost"
            size="xs"
            color="primary-100"
            onClick={table.getToggleAllColumnsVisibilityHandler()}
          >
            SHOW / HIDE ALL
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default VisibilityPopover;
