import { Flex, Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <Flex width="full" justifyContent="center">
      <Spinner color="accent-500" size="xl" />
    </Flex>
  );
}

export default Loading;
