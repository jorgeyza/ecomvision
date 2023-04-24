import { Flex, useDisclosure } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export interface User {
  id: string;
  name: string;
  occupation: string;
}

interface Props {
  children: React.ReactNode;
  className: string;
}

const Layout = ({ children, className }: Props) => {
  const { isOpen: isSidebarOpen, onToggle: onToggleSideBar } = useDisclosure({
    defaultIsOpen: true,
  });

  return (
    <Flex
      className={className}
      backgroundColor="background"
      overflowX={isSidebarOpen ? "hidden" : undefined}
      data-test="app-layout"
    >
      <Sidebar isOpen={isSidebarOpen} onToggle={onToggleSideBar} />
      <Flex direction="column" w="full" maxH="100vh" data-test="right-side">
        <Navbar onSidebarToggle={onToggleSideBar} />
        <Flex
          as="main"
          align="flex-start"
          direction="column"
          flexGrow={1}
          rowGap={4}
          overflow="auto"
          maxH="calc(100vh - 56px)"
          maxW={isSidebarOpen ? "calc(100vw - 250px)" : "100vw"}
          p={6}
          data-test="main-container"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
