import { useMemo } from "react";
import { ResponsiveLine, type Serie } from "@nivo/line";
import { useToken } from "@chakra-ui/react";

import { type RouterOutputs } from "~/utils/api";

type SalesStats = RouterOutputs["overallStats"]["getSales"];

interface Props {
  data: SalesStats;
  isDashboard?: boolean;
  view: "units" | "sales";
}

const OverviewChart = ({ data, isDashboard = false, view }: Props) => {
  const [accent200, accent500, accent600, primary500] = useToken("colors", [
    "accent-200",
    "accent-500",
    "accent-600",
    "primary-500",
  ]);

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;

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

    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        if (!month || !totalSales || !totalUnits) return acc;

        const curSales = acc.sales + totalSales;
        const curUnits = acc.units + totalUnits;

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: month, y: curSales },
        ];
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: month, y: curUnits },
        ];

        return { sales: curSales, units: curUnits };
      },
      { sales: 0, units: 0 }
    );

    return [[totalSalesLine], [totalUnitsLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!totalSalesLine || !totalUnitsLine) return <p>No data</p>;

  return (
    <ResponsiveLine
      data={view === "sales" ? totalSalesLine : totalUnitsLine}
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
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (value: string) => {
          if (isDashboard) return value.slice(0, 3);
          return value;
        },
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -60,
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
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
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
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;
