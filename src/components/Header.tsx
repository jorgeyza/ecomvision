import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import { Menu, Search, Sun, Moon, Settings } from "lucide-react";

interface Props {
  onSidebarToggle: () => void;
}

function Header({ onSidebarToggle }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justifyContent="space-between" data-test="header">
      <Flex data-test="header-left-side">
        <IconButton
          onClick={onSidebarToggle}
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
        <IconButton
          aria-label="Open settings"
          icon={<Settings />}
          backgroundColor="transparent"
        />
      </Flex>
    </Flex>
  );
}

export default Header;
