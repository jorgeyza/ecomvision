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
} from "@chakra-ui/react";
import {
  Home,
  ShoppingCart,
  Users,
  FileText,
  Globe2,
  Calculator,
  CalendarDays,
  CalendarRange,
  PieChart,
  ShieldAlert,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Settings } from "lucide-react";

import profileImage from "~/assets/profile_image.jpg";
import NextImage from "next/image";

interface User {
  id: string;
  name: string;
  occupation: string;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  user: User;
}

const navItems = [
  {
    label: "Dashboard",
    icon: <Home />,
  },
  {
    label: "Client Facing",
    icon: null,
  },
  {
    label: "Products",
    icon: <ShoppingCart />,
  },
  {
    label: "Customers",
    icon: <Users />,
  },
  {
    label: "Transactions",
    icon: <FileText />,
  },
  {
    label: "Geography",
    icon: <Globe2 />,
  },
  {
    label: "Sales",
    icon: null,
  },
  {
    label: "Overview",
    icon: <Calculator />,
  },
  {
    label: "Daily",
    icon: <CalendarDays />,
  },
  {
    label: "Monthly",
    icon: <CalendarRange />,
  },
  {
    label: "Breakdown",
    icon: <PieChart />,
  },
  {
    label: "Management",
    icon: null,
  },
  {
    label: "Admin",
    icon: <ShieldAlert />,
  },
  {
    label: "Performance",
    icon: <TrendingUp />,
  },
];

const Sidebar = ({ isOpen, onToggle, user }: Props) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const [active, setActive] = useState("");

  function handleOnClickLink(lowcaseLabel: string) {
    setActive(lowcaseLabel);
    onToggle();
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
          <ChevronLeft />
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
                    active === lowcaseLabel ? "accent-100" : "whiteAlpha.200",
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
                    {active === lowcaseLabel && <ChevronRight size={16} />}
                  </Flex>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </nav>
      <Flex
        flexDirection="column"
        alignItems="center"
        color="accent-300"
        bottom="2rem"
      >
        <Divider />
        <Flex alignItems="center" columnGap={4} marginY={8}>
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
              src={profileImage}
            />
          </Box>
          <div>
            <Text color="accent-100" fontWeight="bold" fontSize="small">
              {user?.name ?? "usersomtheing"}
            </Text>
            <Text color="accent-200" fontSize="smaller">
              {user?.occupation ?? "usersomtheing"}
            </Text>
          </div>
          <Settings size={24} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
