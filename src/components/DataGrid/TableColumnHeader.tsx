import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Th,
  Tooltip,
} from "@chakra-ui/react";
import { type Header, flexRender } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { ArrowUpIcon, ArrowDownIcon, MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

import { selectedTableColumnAtom } from "~/pages/_app";

interface Props<T extends object> {
  header: Header<T, unknown>;
  onToggleVisibilityPopover: () => void;
  onToggleFilterPopover: () => void;
}

const TableColumnHeader = <T extends object>({
  header,
  onToggleVisibilityPopover,
  onToggleFilterPopover,
}: Props<T>) => {
  const [, setSelectedTableColumn] = useAtom(selectedTableColumnAtom);

  const [isColumnHeaderHovered, setIsColumnHeaderHovered] = useState(false);

  function handleOnClickFilterOption(column: string) {
    setSelectedTableColumn(column);
    onToggleFilterPopover();
  }

  return (
    <Th
      color="accent-100"
      onMouseOver={() => setIsColumnHeaderHovered(true)}
      onMouseOut={() => setIsColumnHeaderHovered(false)}
    >
      {header.isPlaceholder ? null : (
        <Flex height="24px" columnGap={2} alignItems="center">
          <Flex
            alignItems="center"
            flexGrow={1}
            cursor={header.column.getCanSort() ? "pointer" : undefined}
            columnGap={2}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            <Tooltip label="Sort" placement="bottom-start" fontSize="sm">
              {{
                asc: (
                  <IconButton
                    aria-label="Sort in descending order"
                    icon={<ArrowUpIcon size={16} />}
                    backgroundColor="transparent"
                    size="xs"
                  />
                ),
                desc: (
                  <IconButton
                    aria-label="Undo sorting"
                    icon={<ArrowDownIcon size={16} />}
                    backgroundColor="transparent"
                    size="xs"
                  />
                ),
              }[header.column.getIsSorted() as string] ?? (
                <IconButton
                  aria-label="Sort in descending order"
                  color="neutral-300"
                  opacity={isColumnHeaderHovered ? 1 : 0}
                  icon={<ArrowUpIcon size={16} />}
                  backgroundColor="transparent"
                  size="xs"
                />
              )}
            </Tooltip>
          </Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              opacity={isColumnHeaderHovered ? 1 : 0}
              icon={<MoreVerticalIcon size={16} />}
              size="xs"
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                onClick={() =>
                  handleOnClickFilterOption(
                    header.column.columnDef.header as string
                  )
                }
              >
                Filter
              </MenuItem>
              <MenuItem onClick={header.column.getToggleVisibilityHandler()}>
                Hide
              </MenuItem>
              <MenuItem onClick={onToggleVisibilityPopover}>
                Show columns
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Th>
  );
};

export default TableColumnHeader;
