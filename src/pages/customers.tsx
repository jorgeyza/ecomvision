import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { type ReactNode, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type Header,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";

type Customer = RouterOutputs["user"]["getAllWithUserRole"][0];

const columnHelper = createColumnHelper<Customer>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    cell: (props) =>
      props.getValue()?.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3"),
  }),
  columnHelper.accessor("country", {
    header: "Country",
  }),
  columnHelper.accessor("occupation", {
    header: "Occupation",
  }),
  columnHelper.accessor("role", {
    header: "Role",
  }),
];

const Customers: NextPage = () => {
  const {
    data: allCustomers = [],
    status,
    error,
  } = api.user.getAllWithUserRole.useQuery();

  const { isOpen, onToggle, onClose } = useDisclosure();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [popoverSearchedColumn, setPopoverSearchedColumn] = useState("");

  const table = useReactTable({
    data: allCustomers,
    columns,
    state: {
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <PageHeadings title="CUSTOMERS" subtitle="List of customers" />
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="center"
        position="relative"
      >
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <>
            <TableContainer height="75vh" overflowY="auto" width="100%">
              <Table
                variant="simple"
                backgroundColor="background-emphasis"
                fontSize="xs"
                width="100%"
              >
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableColumnHeader
                          key={header.id}
                          header={header}
                          onToggle={onToggle}
                        />
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody backgroundColor="primary-subtle">
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
                <Tfoot>
                  {table.getFooterGroups().map((footerGroup) => (
                    <Tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <Th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext()
                              )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Tfoot>
              </Table>
            </TableContainer>
            <Popover
              returnFocusOnClose={false}
              isOpen={isOpen}
              onClose={onClose}
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
                      const columnToBeFiltered = column.columnDef
                        .header as string;
                      return columnToBeFiltered
                        .toLowerCase()
                        .includes(popoverSearchedColumn);
                    })
                    .map((column) => {
                      return (
                        <FormControl
                          key={column.id + "a"}
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
                    SHOW/HIDE ALL
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        )}
      </Flex>
    </>
  );
};

export default Customers;

interface Props {
  header: Header<Customer, unknown>;
  onToggle: () => void;
}

function TableColumnHeader({ header, onToggle }: Props) {
  const [isColumnHeaderHovered, setIsColumnHeaderHovered] = useState(false);

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
                    icon={<ArrowUp size={16} />}
                    backgroundColor="transparent"
                    size="xs"
                  />
                ),
                desc: (
                  <IconButton
                    aria-label="Undo sorting"
                    icon={<ArrowDown size={16} />}
                    backgroundColor="transparent"
                    size="xs"
                  />
                ),
              }[header.column.getIsSorted() as string] ?? (
                <IconButton
                  aria-label="Sort in descending order"
                  color="neutral-300"
                  opacity={isColumnHeaderHovered ? 1 : 0}
                  icon={<ArrowUp size={16} />}
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
              icon={<MoreVertical size={16} />}
              size="xs"
              variant="ghost"
            />
            <MenuList>
              <MenuItem>Filter</MenuItem>
              <MenuItem onClick={header.column.getToggleVisibilityHandler()}>
                Hide
              </MenuItem>
              <MenuItem onClick={onToggle}>Show columns</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Th>
  );
}
