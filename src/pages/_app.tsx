import { type AppType } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";

import Layout from "~/components/layout";

import { api } from "~/utils/api";

import theme from "~/theme";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraBaseProvider theme={theme}>
      <Layout className={inter.className}>
        <Component {...pageProps} />
      </Layout>
    </ChakraBaseProvider>
  );
};

export default api.withTRPC(MyApp);
