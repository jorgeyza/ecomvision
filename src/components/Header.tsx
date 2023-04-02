import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  Menu as MenuIcon,
  Search,
  Sun,
  Moon,
  Settings,
  ChevronDown,
} from "lucide-react";
import NextImage from "next/image";

import profileImage from "~/assets/profile_image.jpg";
import { type User } from "./layout";

interface Props {
  onSidebarToggle: () => void;
  user: User;
}

function Header({ onSidebarToggle, user }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      height="64px"
      justifyContent="space-between"
      alignItems="center"
      paddingX={6}
      data-test="header"
    >
      <Flex data-test="header-left-side" alignItems="center" columnGap={2}>
        <IconButton
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
          icon={<MenuIcon size={20} />}
          backgroundColor="transparent"
        />
        <InputGroup>
          <Input
            borderRadius="md"
            fontSize="sm"
            variant="filled"
            placeholder="Search..."
          />
          <InputRightElement marginRight={2}>
            <Search size={20} />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Flex columnGap={6} data-test="header-right-side" alignItems="center">
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
        <Menu>
          <MenuButton
            as={Button}
            backgroundColor="transparent"
            color="accent-300"
            height="56px"
            rightIcon={<ChevronDown />}
          >
            <Flex alignItems="center" columnGap={4}>
              <Box
                position="relative"
                overflow="hidden"
                width="32px"
                height="32px"
                borderRadius="50%"
              >
                <NextImage
                  alt="profile"
                  style={{ objectFit: "cover" }}
                  fill
                  src={profileImage}
                />
              </Box>
              <Flex flexDirection="column" alignItems="start">
                <Text color="accent-100" fontWeight="bold" fontSize="small">
                  {user?.name}
                </Text>
                <Text color="accent-200" fontWeight="normal" fontSize="smaller">
                  {user?.occupation}
                </Text>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default Header;
