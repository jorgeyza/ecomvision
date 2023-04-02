import { Flex, useDisclosure } from "@chakra-ui/react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
  className: string;
}

const DUMMY_USER = {
  id: "abc13824",
  name: "Jorge",
  occupation: "Developer",
};

const Layout = ({ children, className }: Props) => {
  const { isOpen: isSidebarOpen, onToggle: onToggleSideBar } = useDisclosure();

  return (
    <Flex
      className={className}
      overflowX={isSidebarOpen ? "hidden" : undefined}
      data-test="app-layout"
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={onToggleSideBar}
        user={DUMMY_USER}
      />
      <Flex direction="column" w="full" maxH="100vh" data-test="right-side">
        <Header onSidebarToggle={onToggleSideBar} />
        <Flex
          as="main"
          align="flex-start"
          direction="column"
          flexGrow={1}
          rowGap={4}
          // maxW={isSidebarOpen ? "calc(100vw - 250px)" : "100vw"}
          maxH="calc(100vh - 40px)"
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
