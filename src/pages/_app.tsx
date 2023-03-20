import { type AppType } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";

import { api } from "~/utils/api";

import theme from "~/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraBaseProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraBaseProvider>
  );
};

export default api.withTRPC(MyApp);
