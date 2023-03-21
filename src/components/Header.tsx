import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import { Menu, Search, Sun, Moon, Settings } from "lucide-react";
import { useAtom } from "jotai";

import { drawerAtom } from "~/pages/_app";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [, setIsDrawerOpen] = useAtom(drawerAtom);

  function handleToggleDrawer() {
    setIsDrawerOpen((prevState) => !prevState);
  }

  return (
    <Flex justifyContent="space-between" data-test="header">
      <Flex data-test="header-left-side">
        <IconButton
          onClick={handleToggleDrawer}
          aria-label="Toggle sidebar"
          icon={<Menu />}
          backgroundColor="transparent"
        />
        <InputGroup>
          <Input placeholder="Search" />
          <InputRightElement>
            <Search />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Flex data-test="header-right-side">
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle app color theme"
          icon={colorMode === "dark" ? <Moon /> : <Sun />}
          backgroundColor="transparent"
        />
        <IconButton aria-label="Open settings" icon={<Settings />} backgroundColor="transparent" />
      </Flex>
    </Flex>
  );
}

export default Header;
