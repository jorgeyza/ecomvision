import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";
import { useState } from "react";
import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";

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

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: allCustomers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <PageHeadings title="CUSTOMERS" subtitle="List of customers" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <TableContainer height="75vh" overflowY="auto">
            <Table
              variant="simple"
              backgroundColor="background-emphasis"
              fontSize="xs"
            >
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <Flex height="24px" alignItems="center">
                            <Tooltip
                              label="Sort"
                              placement="bottom-start"
                              fontSize="sm"
                            >
                              <Flex
                                alignItems="center"
                                flexGrow={1}
                                cursor={
                                  header.column.getCanSort()
                                    ? "pointer"
                                    : undefined
                                }
                                columnGap={2}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
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
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </Flex>
                            </Tooltip>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<MoreVertical size={16} />}
                                size="xs"
                                variant="ghost"
                              />
                              <MenuList>
                                <MenuItem>Unsort</MenuItem>
                                <MenuItem>Sort by ASC</MenuItem>
                                <MenuItem>Sort by DESC</MenuItem>
                                <MenuItem>Sort by Filter</MenuItem>
                                <MenuItem>Hide</MenuItem>
                                <MenuItem>Show columns</MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
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
        )}
      </Flex>
    </>
  );
};

export default Customers;
