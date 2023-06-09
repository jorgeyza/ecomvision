import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Text,
  Link,
  Box,
  Divider,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  FileTextIcon,
  Globe2Icon,
  CalculatorIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  PieChartIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "lucide-react";
import { useAtom } from "jotai";
import NextImage from "next/image";

import Loading from "./ui/Loading";

import profileImage from "~/assets/profile_image.jpg";
import { api } from "~/utils/api";
import { currentUserIdAtom } from "~/pages/_app";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Client Facing",
    icon: null,
  },
  {
    label: "Products",
    icon: <ShoppingCartIcon />,
  },
  {
    label: "Customers",
    icon: <UsersIcon />,
  },
  {
    label: "Transactions",
    icon: <FileTextIcon />,
  },
  {
    label: "Geography",
    icon: <Globe2Icon />,
  },
  {
    label: "Sales",
    icon: null,
  },
  {
    label: "Overview",
    icon: <CalculatorIcon />,
  },
  {
    label: "Daily",
    icon: <CalendarDaysIcon />,
  },
  {
    label: "Monthly",
    icon: <CalendarRangeIcon />,
  },
  {
    label: "Breakdown",
    icon: <PieChartIcon />,
  },
  {
    label: "Management",
    icon: null,
  },
  {
    label: "Admin",
    icon: <ShieldAlertIcon />,
  },
  {
    label: "Performance",
    icon: <TrendingUpIcon />,
  },
];

const Sidebar = ({ isOpen, onToggle }: Props) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const [isSmallerOrEqualTo768] = useMediaQuery("(max-width: 768px)");
  const hoverBackgroundColor = useColorModeValue(
    "blackAlpha.200",
    "whiteAlpha.200"
  );

  const [currentUserId] = useAtom(currentUserIdAtom);
  const [active, setActive] = useState("");

  const {
    data: user,
    status,
    error,
  } = api.user.getUser.useQuery({
    id: currentUserId,
  });

  function handleOnClickLink(lowcaseLabel: string) {
    setActive(lowcaseLabel);
    if (isSmallerOrEqualTo768) onToggle();
  }

  useEffect(() => {
    setActive(currentPath.substring(1));
  }, [currentPath]);

  return (
    <Flex
      as="aside"
      direction="column"
      overflowX="hidden"
      justifyContent="space-between"
      w={0}
      minW={{ base: isOpen ? "100vw" : 0, sm: isOpen ? 250 : 0 }}
      h="100vh"
      color="accent-200"
      backgroundColor="background-emphasis"
      transition="all .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)"
      transform="auto"
      translateX={isOpen ? "0%" : "-100%"}
      visibility={isOpen ? "visible" : "hidden"}
      data-test="sidebar"
    >
      <div data-test="side-bar-top">
        <Flex
          justifyContent="center"
          alignItems="center"
          color="accent-400"
          columnGap="0.5rem"
          marginTop={6}
        >
          <Heading color="accent-emphasis" as="h4" size="md" fontWeight="bold">
            ECOMVISION
          </Heading>
          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            color="white"
            backgroundColor="transparent"
            aria-label="close-drawer"
            onClick={onToggle}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Flex>

        <nav>
          <List marginY={12}>
            {navItems.map(({ label, icon }) => {
              if (!icon) {
                return (
                  <Text
                    as="h4"
                    fontWeight="bold"
                    paddingX={4}
                    paddingY={2}
                    key={label}
                    marginTop={9}
                    marginLeft={4}
                  >
                    {label}
                  </Text>
                );
              }
              const lowcaseLabel = label.toLowerCase();

              return (
                <ListItem
                  key={label}
                  backgroundColor={
                    active === lowcaseLabel ? "accent-300" : "transparent"
                  }
                  _hover={{
                    backgroundColor:
                      active === lowcaseLabel
                        ? "accent-400"
                        : hoverBackgroundColor,
                  }}
                  color={active === lowcaseLabel ? "primary-600" : "accent-100"}
                >
                  <Link
                    as={NextLink}
                    display="flex"
                    alignItems="center"
                    width="100%"
                    paddingX={4}
                    paddingY={2}
                    columnGap={4}
                    _hover={{
                      textDecoration: "none",
                    }}
                    href={`/${lowcaseLabel}`}
                    onClick={() => handleOnClickLink(lowcaseLabel)}
                  >
                    <ListIcon
                      marginLeft={8}
                      color={
                        active === lowcaseLabel ? "primary-600" : "accent-200"
                      }
                    >
                      {icon}
                    </ListIcon>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Text fontSize="sm">{label}</Text>
                      {active === lowcaseLabel && (
                        <ChevronRightIcon size={16} />
                      )}
                    </Flex>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </div>
      <Flex
        flexDirection="column"
        alignItems="center"
        color="accent-300"
        data-test="side-bar-bottom"
      >
        <Divider />
        <Flex alignItems="center" columnGap={4} marginY={8}>
          {status === "loading" ? (
            <Loading />
          ) : status === "error" ? (
            <p>Error {error.message}</p>
          ) : (
            <>
              <Box
                position="relative"
                overflow="hidden"
                width="40px"
                height="40px"
                borderRadius="50%"
              >
                <NextImage
                  alt="profile"
                  style={{ objectFit: "cover" }}
                  fill
                  sizes="40px"
                  src={profileImage}
                />
              </Box>
              <div>
                <Text color="accent-100" fontWeight="bold" fontSize="small">
                  {user?.name}
                </Text>
                <Text color="accent-200" fontSize="smaller">
                  {user?.occupation}
                </Text>
              </div>
              <SettingsIcon size={24} />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
