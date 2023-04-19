import { Flex, useToken } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useMemo } from "react";
import { ResponsiveLine, type Serie } from "@nivo/line";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { api } from "~/utils/api";

const Overview: NextPage = () => {
  const [accent200, accent500, accent600, primary500] = useToken("colors", [
    "accent-200",
    "accent-500",
    "accent-600",
    "primary-500",
  ]);

  const {
    data: allSales,
    status,
    error,
  } = api.overallStats.getSales.useQuery();

  const [formattedData] = useMemo(() => {
    if (!allSales) return [];

    const { monthlyData } = allSales;
    const totalSalesLine: Serie = {
      id: "totalSales",
      color: accent500,
      data: [],
    };
    const totalUnitsLine: Serie = {
      id: "totalUnits",
      color: accent600,
      data: [],
    };

    Object.values(monthlyData).forEach(({ month, totalSales, totalUnits }) => {
      totalSalesLine.data = [
        ...totalSalesLine.data,
        { x: month, y: totalSales },
      ];
      totalUnitsLine.data = [
        ...totalUnitsLine.data,
        { x: month, y: totalUnits },
      ];
    });

    const formattedData = [totalSalesLine, totalUnitsLine];
    return [formattedData];
  }, [allSales]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeadings title="DAILY SALES" subtitle="Chart of daily sales" />
      <Flex width="100%" flexDirection="column" alignItems="center">
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <p>Error {error.message}</p>
        ) : (
          <Flex flexDirection="column" height="75vh" width="100%">
            {formattedData && (
              <ResponsiveLine
                data={formattedData}
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
                colors={{ datum: "color" }}
                margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 90,
                  legend: "Month",
                  legendOffset: 60,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Total",
                  legendOffset: -50,
                  legendPosition: "middle",
                }}
                enableGridX={false}
                enableGridY={false}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: "top-right",
                    direction: "column",
                    justify: false,
                    translateX: 50,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default Overview;
