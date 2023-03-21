import { type AppType } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { atom, Provider } from "jotai";

import Layout from "~/components/layout";

import { api } from "~/utils/api";

import theme from "~/theme";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const drawerAtom = atom(true);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraBaseProvider theme={theme}>
      <Provider>
        <Layout className={inter.className}>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ChakraBaseProvider>
  );
};

export default api.withTRPC(MyApp);
