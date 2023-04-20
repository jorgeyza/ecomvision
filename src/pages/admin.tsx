import { Flex } from "@chakra-ui/react";
import { type NextPage } from "next";
import { createColumnHelper, type FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { type RouterOutputs, api } from "~/utils/api";
import DataGrid from "~/components/DataGrid";

type Admin = RouterOutputs["user"]["getAllWithAdminRole"][0];

const fuzzyFilter: FilterFn<Admin> = (
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

const columnHelper = createColumnHelper<Admin>();

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

const Admin: NextPage = () => {
  const {
    data: allAdmins = [],
    status,
    error,
  } = api.user.getAllWithAdminRole.useQuery();

  return (
    <>
      <PageHeadings
        title="ADMINS"
        subtitle="Managing admins and list of admins"
      />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <DataGrid<Admin>
            data={allAdmins}
            columns={columns}
            filterFn={fuzzyFilter}
          />
        )}
      </Flex>
    </>
  );
};

export default Admin;
