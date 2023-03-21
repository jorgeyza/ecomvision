import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { drawerAtom } from "~/pages/_app";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
  className: string;
}

const Layout = ({ children, className }: Props) => {
  const [isDrawerOpen] = useAtom(drawerAtom);
  return (
    <Flex className={className} data-test="app-layout">
      <Sidebar />
      <Flex direction="column" w="full" maxH="100vh" data-test="right-side">
        <Header />
        <Flex
          as="main"
          align="flex-start"
          direction="column"
          flexGrow={1}
          rowGap={4}
          maxW={isDrawerOpen ? "calc(100vw - 300px)" : "100vw"}
          maxH="calc(100vh - 97px)"
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
