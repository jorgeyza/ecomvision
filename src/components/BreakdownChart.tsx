import { Box, Text, useToken } from "@chakra-ui/react";
import { ResponsivePie } from "@nivo/pie";

import { type RouterOutputs } from "~/utils/api";

type SalesStats = RouterOutputs["overallStats"]["getSales"];

interface Props {
  data: SalesStats;
  isDashboard?: boolean;
}

const BreakdownChart = ({ data, isDashboard = false }: Props) => {
  const [accent200, accent300, accent400, accent500, primary500] = useToken(
    "colors",
    ["accent-200", "accent-300", "accent-400", "accent-500", "primary-500"]
  );

  if (!data) return <p>No data!</p>;
  const { salesByCategory, yearlySalesTotal } = data;

  const colors = [accent500, accent300, accent300, accent500];
  const formattedData = Object.entries(salesByCategory).map(
    ([category, sales], i) => ({
      id: category,
      label: category,
      value: sales,
      color: colors[i],
    })
  );

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      {formattedData && (
        <ResponsivePie
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
          colors={{ datum: "data.color" }}
          margin={
            isDashboard
              ? { top: 40, right: 80, bottom: 100, left: 50 }
              : { top: 40, right: 80, bottom: 80, left: 80 }
          }
          sortByValue={true}
          innerRadius={0.45}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          enableArcLinkLabels={!isDashboard}
          arcLinkLabelsTextColor={accent200}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: isDashboard ? 20 : 0,
              translateY: isDashboard ? 50 : 56,
              itemsSpacing: 0,
              itemWidth: 85,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: primary500,
                  },
                },
              ],
            },
          ]}
        />
      )}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={accent400}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-75%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Text>
          {!isDashboard && "Total:"} ${yearlySalesTotal}
        </Text>
      </Box>
    </Box>
  );
};

export default BreakdownChart;
