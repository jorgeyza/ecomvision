import { Flex, useToken } from "@chakra-ui/react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { type NextPage } from "next";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { api } from "~/utils/api";
import { geoData } from "~/utils/geoData";

const Geography: NextPage = () => {
  const [accent100, accent200, primary500, neutral300] = useToken("colors", [
    "accent-100",
    "accent-200",
    "primary-500",
    "neutral-200",
  ]);

  const {
    data: usersByCountry = [],
    status,
    error,
  } = api.user.getGeography.useQuery();

  return (
    <>
      <PageHeadings
        title="GEOGRAPHY"
        subtitle="Find where your users are located"
      />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <Flex
            height="75vh"
            width="100%"
            border="1px solid"
            borderColor="accent-200"
            backgroundColor="background-emphasis"
            borderRadius="4px"
          >
            <ResponsiveChoropleth
              data={usersByCountry}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: accent200,
                    },
                  },
                  legend: {
                    text: {
                      fill: accent200,
                    },
                  },
                  ticks: {
                    line: {
                      stroke: accent200,
                      strokeWidth: 1,
                    },
                    text: {
                      fill: accent200,
                    },
                  },
                },
                legends: {
                  text: {
                    fill: accent200,
                  },
                },
                tooltip: {
                  container: {
                    color: primary500,
                  },
                },
              }}
              colors="greens"
              features={geoData.features}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              domain={[0, 60]}
              unknownColor="#666666"
              label="properties.name"
              valueFormat=".2s"
              projectionScale={150}
              projectionTranslation={[0.5, 0.6]}
              projectionRotation={[0, 0, 0]}
              borderWidth={1.3}
              borderColor={neutral300}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: true,
                  translateX: -25,
                  translateY: -75,
                  itemsSpacing: 0,
                  itemWidth: 94,
                  itemHeight: 18,
                  itemDirection: "left-to-right",
                  itemTextColor: accent200,
                  itemOpacity: 0.85,
                  symbolSize: 18,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: accent100,
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Geography;
