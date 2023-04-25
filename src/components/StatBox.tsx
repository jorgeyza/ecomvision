import { type ReactNode } from "react";
import { Flex, GridItem, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  value: number;
  increase: string;
  icon: ReactNode;
  description: string;
}

const StatBox = ({ title, value, increase, icon, description }: Props) => {
  return (
    <GridItem
      display="flex"
      gridColumn={{ base: "span 12", sm: "span 6", md: "span 2" }}
      gridRow="span 1"
      flexDirection="column"
      justifyContent="space-between"
      px={4}
      py={5}
      flex="1 1 100%"
      backgroundColor="background-emphasis"
      borderRadius="md"
    >
      <Flex justifyContent="space-between" color="accent-200">
        <Text as="h6" fontSize="sm" color="accent-100">
          {title}
        </Text>
        {icon}
      </Flex>

      <Text as="h3" fontWeight="bold" fontSize="2xl" color="accent-200">
        {value}
      </Text>
      <Flex columnGap={4} alignItems="center">
        <Text as="h5" fontSize="sm" fontStyle="italic" color="accent-400">
          {increase}
        </Text>
        <Text>{description}</Text>
      </Flex>
    </GridItem>
  );
};

export default StatBox;
