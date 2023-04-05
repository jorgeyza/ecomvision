import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import Head from "next/head";
import Loading from "~/components/ui/Loading";

import PageHeadings from "~/components/ui/PageHeadings";
import { api } from "~/utils/api";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  supply: number;
  stat?: ProductStat;
}

interface ProductStat {
  yearlySalesTotal?: number;
  yearlyTotalSoldUnits?: number;
}

const Products: NextPage = () => {
  const { data: allProducts, status, error } = api.product.getAll.useQuery();
  console.log("🚀 ~ file: products.tsx:25 ~ allProducts:", allProducts);
  return (
    <>
      <Head>
        <title>Ecomvision</title>
        <meta
          name="description"
          content="View your data easily in this dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeadings title="PRODUCTS" subtitle="See your list of products" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <Grid templateColumns="repeat(4, minmax(0px, 1fr))" gap={5}>
            {allProducts?.map((product) => {
              return (
                <GridItem key={product.id} width="100%">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    rating={product.rating}
                    category={product.category}
                    supply={product.supply}
                    stat={product.productStat[0]}
                  />
                </GridItem>
              );
            })}
          </Grid>
        )}
      </Flex>
    </>
  );
};

function ProductCard({
  id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}: ProductCardProps) {
  return (
    <Card backgroundColor="background-emphasis">
      <CardHeader>
        <Text>{category}</Text>
        <Heading as="h6" size="xs">
          {name}
        </Heading>
        <Text>{price}</Text>
      </CardHeader>
      <CardBody>
        <Text>View a summary of all your customers over the last month.</Text>
      </CardBody>
      <CardFooter>lalala</CardFooter>
    </Card>
  );
}

export default Products;
