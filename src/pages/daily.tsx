import {
  Button,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useToken,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { type DateRange, DayPicker } from "react-day-picker";
import { ResponsiveLine, type Serie } from "@nivo/line";
import "react-day-picker/dist/style.css";

import Loading from "~/components/ui/Loading";
import PageHeadings from "~/components/ui/PageHeadings";

import { api } from "~/utils/api";
import { CalendarRangeIcon } from "lucide-react";

const Overview: NextPage = () => {
  const [accent200, accent500, accent600, primary500] = useToken("colors", [
    "accent-200",
    "accent-500",
    "accent-600",
    "primary-500",
  ]);

  const defaultSelected: DateRange = {
    from: new Date("2021-02-01"),
    to: new Date("2021-03-01"),
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  let buttonText = "Please pick the first day.";
  if (range?.from) {
    if (!range.to) {
      buttonText = format(range.from, "PP");
    } else if (range.to) {
      buttonText = `${format(range.from, "PP")} - ${format(range.to, "PP")}`;
    }
  }

  const css = `
  .rdp {
    --rdp-cell-size: 30px;
    --rdp-caption-font-size: 16px;
    margin: 8px
  }
  .rdp-months {
    justify-content: center
  }
`;

  const {
    data: allSales,
    status,
    error,
  } = api.overallStats.getSales.useQuery();

  const [formattedData] = useMemo(() => {
    if (!allSales) return [];

    const { dailyData } = allSales;
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

    Object.values(dailyData).forEach(({ date, totalSales, totalUnits }) => {
      if (
        !date ||
        !totalSales ||
        !totalUnits ||
        !range ||
        !range.from ||
        !range.to
      )
        return;
      const dateFormatted = new Date(date);
      if (dateFormatted >= range.from && dateFormatted <= range.to) {
        const splitDate = date.substring(date.indexOf("-") + 1);

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: splitDate, y: totalSales },
        ];
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: splitDate, y: totalUnits },
        ];
      }
    });

    const formattedData = [totalSalesLine, totalUnitsLine];
    return [formattedData];
  }, [allSales, range?.from, range?.to]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Popover>
              <PopoverTrigger>
                <Button
                  size={{ base: "xs", sm: "md" }}
                  maxWidth={350}
                  padding={4}
                  alignSelf="end"
                >
                  <Flex columnGap={2}>
                    {buttonText}
                    <Icon as={CalendarRangeIcon} />
                  </Flex>
                </Button>
              </PopoverTrigger>
              <PopoverContent maxWidth={240}>
                <PopoverBody padding={0}>
                  <style>{css}</style>
                  <DayPicker
                    mode="range"
                    defaultMonth={new Date("2021-02-01")}
                    selected={range}
                    onSelect={setRange}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
                curve="catmullRom"
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
