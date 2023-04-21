import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type NextPage } from "next";

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
  return (
    <>
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
                <GridItem
                  key={product.id}
                  width="100%"
                  colSpan={{ base: 4, md: 2, lg: 1 }}
                >
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
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Card backgroundColor="background-emphasis">
      <CardHeader>
        <Text color="accent-700" fontSize="sm">
          {category}
        </Text>
        <Stat>
          <StatLabel marginTop={1} fontWeight="bold">
            {name}
          </StatLabel>
          <StatNumber color="accent-400" fontSize="sm">
            ${Number(price).toFixed(2)}
          </StatNumber>
        </Stat>
      </CardHeader>
      <CardBody display="flex" flexDirection="column" rowGap={1}>
        <Text fontSize="xs">
          Rating: <strong>{rating}</strong>
        </Text>
        <Text fontSize="xs" minHeight={63}>
          {description}
        </Text>
      </CardBody>
      <CardFooter flexDirection="column">
        <Button size="sm" onClick={onToggle}>
          SHOW MORE
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <Flex
            marginTop={3}
            flexDirection="column"
            rowGap={1}
            color="neutral-300"
          >
            <Text fontSize="xs">
              <Text as="span" fontWeight="bold" color="neutral-100">
                id:
              </Text>{" "}
              {id}
            </Text>
            <Text fontSize="xs">
              <Text as="span" fontWeight="bold" color="neutral-100">
                Supply Left:
              </Text>{" "}
              {supply}
            </Text>
            <Text fontSize="xs">
              <Text as="span" fontWeight="bold" color="neutral-100">
                Yearly Sales This Year:
              </Text>{" "}
              {stat?.yearlySalesTotal}
            </Text>
            <Text fontSize="xs">
              <Text as="span" fontWeight="bold" color="neutral-100">
                Yearly Units Sold This Year:
              </Text>{" "}
              {stat?.yearlyTotalSoldUnits}
            </Text>
          </Flex>
        </Collapse>
      </CardFooter>
    </Card>
  );
}

export default Products;
