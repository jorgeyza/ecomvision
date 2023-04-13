import { type AppType } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { atom } from "jotai";

import Layout from "~/components/layout";

import { api } from "~/utils/api";

import theme from "~/theme";

const inter = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const selectedTableColumnAtom = atom("");

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraBaseProvider theme={theme}>
      <Layout className={inter.className}>
        <Head>
          <title>Ecomvision</title>
          <meta
            name="description"
            content="View your data easily in this dashboard"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ChakraBaseProvider>
  );
};

export default api.withTRPC(MyApp);
