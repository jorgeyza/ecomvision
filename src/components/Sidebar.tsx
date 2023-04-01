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

interface Props {
  isOpen: boolean;
  onToggle: () => void;
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

const Sidebar = ({ isOpen, onToggle }: Props) => {
  const router = useRouter();
  const currentPath = router.asPath;

  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(currentPath.substring(1));
  }, [currentPath]);
  return (
    <Flex
      as="aside"
      direction="column"
      overflowX="hidden"
      w={0}
      minW={{ base: isOpen ? "100vw" : 0, sm: isOpen ? 250 : 0 }}
      h="100vh"
      color="accent-200"
      backgroundColor="background-emphasis"
      borderRight="1px solid"
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

      <List marginTop={12}>
        {navItems.map(({ label, icon }) => {
          if (!icon) {
            return (
              <Text key={label} marginTop={9}>
                {label}
              </Text>
            );
          }
          const lowcaseLabel = label.toLowerCase();

          return (
            <ListItem key={label}>
              <Link
                as={NextLink}
                display="flex"
                alignItems="center"
                backgroundColor={
                  active === lowcaseLabel ? "accent-300" : "transparent"
                }
                color={active === lowcaseLabel ? "primary-600" : "accent-100"}
                _hover={{
                  textDecoration: "none",
                  backgroundColor: "whiteAlpha.200",
                }}
                href={`/${lowcaseLabel}`}
                onClick={() => {
                  setActive(lowcaseLabel);
                }}
              >
                <ListIcon
                  ml="2rem"
                  color={active === lowcaseLabel ? "primary-600" : "accent-200"}
                >
                  {icon}
                </ListIcon>
                <Text>{label}</Text>
                {active === lowcaseLabel && <ChevronRight />}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
};

export default Sidebar;
