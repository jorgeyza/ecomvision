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
  useMediaQuery,
} from "@chakra-ui/react";
import {
  MenuIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "lucide-react";
import NextImage from "next/image";
import { useAtom } from "jotai";

import Loading from "./ui/Loading";

import profileImage from "~/assets/profile_image.jpg";
import { currentUserIdAtom } from "~/pages/_app";
import { api } from "~/utils/api";

interface Props {
  onSidebarToggle: () => void;
}

function Navbar({ onSidebarToggle }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLargerThan499] = useMediaQuery("(min-width: 500px)");

  const [currentUserId] = useAtom(currentUserIdAtom);

  const {
    data: user,
    status,
    error,
  } = api.user.getUser.useQuery({
    id: currentUserId,
  });

  return (
    <Flex
      as="header"
      height="64px"
      justifyContent="space-between"
      alignItems="center"
      paddingX={6}
      data-test="navbar"
    >
      <Flex data-test="navbar-left-side" alignItems="center" columnGap={2}>
        <IconButton
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
          icon={<MenuIcon size={20} />}
          backgroundColor="transparent"
        />
        {isLargerThan499 && (
          <InputGroup>
            <Input
              borderRadius="md"
              fontSize="sm"
              variant="filled"
              placeholder="Search..."
            />
            <InputRightElement marginRight={2}>
              <SearchIcon size={20} />
            </InputRightElement>
          </InputGroup>
        )}
      </Flex>
      <Flex columnGap={6} data-test="navbar-right-side" alignItems="center">
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle app color theme"
          icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
          backgroundColor="transparent"
        />
        <IconButton
          aria-label="Open settings"
          icon={<SettingsIcon />}
          backgroundColor="transparent"
        />
        <Menu>
          <MenuButton
            as={Button}
            backgroundColor="transparent"
            color="accent-300"
            height="56px"
            rightIcon={<ChevronDownIcon />}
          >
            <Flex alignItems="center" columnGap={4}>
              {status === "loading" ? (
                <Loading />
              ) : status === "error" ? (
                <p>Error {error.message}</p>
              ) : (
                <>
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
                      sizes="32px"
                      src={profileImage}
                    />
                  </Box>
                  {isLargerThan499 && (
                    <Flex flexDirection="column" alignItems="start" rowGap={1}>
                      <Text
                        color="accent-100"
                        fontWeight="bold"
                        fontSize="small"
                      >
                        {user?.name}
                      </Text>
                      <Text
                        color="accent-200"
                        fontWeight="normal"
                        fontSize="xs"
                      >
                        {user?.occupation}
                      </Text>
                    </Flex>
                  )}
                </>
              )}
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

export default Navbar;
