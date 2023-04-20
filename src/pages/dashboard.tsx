import { Button, Flex, Heading } from "@chakra-ui/react";
import { DownloadIcon } from "lucide-react";
import { type NextPage } from "next";

import PageHeadings from "~/components/ui/PageHeadings";

const Dashboard: NextPage = () => {
  return (
    <>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <PageHeadings title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          columnGap={3}
          backgroundColor="accent-200"
          color="primary-500"
          size="lg"
          fontSize="sm"
        >
          <DownloadIcon size={20} />
          DOWNLOAD REPORTS
        </Button>
      </Flex>
      <Heading>SITE UNDER CONSTRUCTION...</Heading>
      <p style={{ fontSize: "24px" }}>Pending</p>
      <ul>
        <li>Dashboard</li>
        <li>Performance</li>
      </ul>
    </>
  );
};

export default Dashboard;
