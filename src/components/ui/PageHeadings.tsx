import { Flex, Heading } from "@chakra-ui/react";

interface Props {
  title: string;
  subtitle: string;
}

function PageHeadings({ title, subtitle }: Props) {
  return (
    <Flex flexDirection="column" rowGap={1}>
      <Heading size="lg" as="h2" fontWeight="bold" color="accent-100">
        {title}
      </Heading>
      <Heading size="sm" as="h5" fontWeight="normal" color="accent-300">
        {subtitle}
      </Heading>
    </Flex>
  );
}

export default PageHeadings;
