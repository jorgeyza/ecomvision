import { Box, Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { drawerAtom } from "~/pages/_app";
import Link from "next/link";

const Sidebar = () => {
  const [isDrawerOpen] = useAtom(drawerAtom);

  return (
    <Flex
      as="aside"
      direction="column"
      overflow="hidden"
      w={0}
      minW={{ base: isDrawerOpen ? "100vw" : 0, sm: isDrawerOpen ? 300 : 0 }}
      h="100vh"
      py={8}
      borderRight="1px solid"
      transition="all .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)"
      data-test="sidebar"
    >
      <Flex w="100%" mb={54} px={6}>
        <Box as={Link} href="/dashboard">
          ECOMVISION
        </Box>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
