import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  Select,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import {
  useState,
  type ReactNode,
  useMemo,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type Header,
  type Table as ReactTable,
  type Column,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreVerticalIcon,
  ColumnsIcon,
  SearchIcon,
} from "lucide-react";
import { useAtom } from "jotai";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";
import useDebounce from "~/utils/useDebounce";
import { selectedTableColumnAtom } from "./_app";
import { getFacetedRowModel } from "@tanstack/react-table";
import { getFacetedUniqueValues } from "@tanstack/react-table";

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
          <Flex
            width="100%"
            flexDirection="column"
            rowGap={1}
            position="relative"
          >
            <TableOptions
              onSetGlobalFilter={setGlobalFilter}
              onToggleVisibilityPopover={onToggleVisibilityPopover}
            />
            <TableContainer overflowY="auto" maxHeight="75vh">
              <Table
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
                    <Tr
                      key={row.id}
                      _hover={{ backgroundColor: "whiteAlpha.200" }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
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
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </Text>
                <Text
                  as="span"
                  fontSize="xs"
                  borderLeft="1px dotted"
                  paddingLeft={2}
                >
                  Go to page:
                </Text>
                <Input
                  type="number"
                  size="xs"
                  maxWidth="40px"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
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
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>
            <FilterPopover
              isOpenFilterPopover={isOpenFilterPopover}
              onCloseFilterPopover={onCloseFilterPopover}
              table={table}
            />
            <VisibilityPopover
              isOpenVisibilityPopover={isOpenVisibilityPopover}
              onCloseVisibilityPopover={onCloseVisibilityPopover}
              table={table}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Customers;

interface Props {
  header: Header<Customer, unknown>;
  onToggleVisibilityPopover: () => void;
  onToggleFilterPopover: () => void;
}

function TableColumnHeader({
  header,
  onToggleVisibilityPopover,
  onToggleFilterPopover,
}: Props) {
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
}

interface FilterPopoverProps {
  isOpenFilterPopover: boolean;
  onCloseFilterPopover: () => void;
  table: ReactTable<Customer>;
}

function FilterPopover({
  isOpenFilterPopover,
  onCloseFilterPopover,
  table,
}: FilterPopoverProps) {
  const [selectedTableColumn, setSelectedTableColumn] = useAtom(
    selectedTableColumnAtom
  );

  const column = useMemo(
    () => table.getColumn(selectedTableColumn.toLowerCase()),
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
              return (
                <option key={columnHeader} value={columnHeader}>
                  {columnHeader}
                </option>
              );
            })}
          </Select>
          {column && <ColumnFilterInput column={column} />}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

interface VisibilityPopoverProps {
  isOpenVisibilityPopover: boolean;
  onCloseVisibilityPopover: () => void;
  table: ReactTable<Customer>;
}

function VisibilityPopover({
  isOpenVisibilityPopover,
  onCloseVisibilityPopover,
  table,
}: VisibilityPopoverProps) {
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
}

interface ColumnFilterInputProps {
  column: Column<Customer, unknown>;
}

function ColumnFilterInput({ column }: ColumnFilterInputProps) {
  const [value, setValue] = useState("");

  const debouncedColumnFilterValue = useDebounce<unknown>(value, 500);

  useEffect(() => {
    column.setFilterValue(debouncedColumnFilterValue);
  }, [column, debouncedColumnFilterValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Filter value... (${column.getFacetedUniqueValues().size})`}
      size="xs"
      variant="flushed"
    />
  );
}

interface TableOptionsProps {
  onSetGlobalFilter: Dispatch<SetStateAction<string>>;
  onToggleVisibilityPopover: () => void;
}

function TableOptions({
  onSetGlobalFilter,
  onToggleVisibilityPopover,
}: TableOptionsProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    onSetGlobalFilter(debouncedValue);
  }, [debouncedValue, onSetGlobalFilter]);

  return (
    <Flex justifyContent="space-between" alignItems="end" columnGap={2}>
      <Button
        leftIcon={<ColumnsIcon size={16} />}
        size="xs"
        variant="ghost"
        onClick={onToggleVisibilityPopover}
      >
        COLUMNS
      </Button>
      <InputGroup size="sm" maxWidth={250}>
        <Input
          borderRadius="md"
          value={value}
          variant="flushed"
          placeholder="Search table..."
          onChange={(e) => setValue(e.target.value)}
        />
        <InputRightElement marginRight={2}>
          <SearchIcon size={16} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
