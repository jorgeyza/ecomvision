import { Flex, Input } from "@chakra-ui/react";
import { type Table, type Column } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import useDebounce from "~/utils/useDebounce";

interface Props<T extends object> {
  column: Column<T, unknown>;
  table: Table<T>;
}

const ColumnFilterInput = <T extends object>({ column, table }: Props<T>) => {
  const [textInputValue, setTextInputValue] = useState("");
  const [minMaxInputValue, setMinMaxInputValue] = useState<
    (number | undefined)[]
  >([]);

  const debouncedColumnTextFilterValue = useDebounce<string>(
    textInputValue,
    500
  );
  const debouncedColumnMinMaxFilterValue = useDebounce<(number | undefined)[]>(
    minMaxInputValue,
    500
  );

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFacetedMinValue = useMemo(
    () => column.getFacetedMinMaxValues()?.[0],
    [column]
  );

  const columnFacetedMaxValue = useMemo(
    () => column.getFacetedMinMaxValues()?.[1],
    [column]
  );

  useEffect(() => {
    if (typeof firstValue === "number") {
      column.setFilterValue([
        debouncedColumnMinMaxFilterValue[0],
        debouncedColumnMinMaxFilterValue[1],
      ]);
    } else {
      column.setFilterValue(debouncedColumnTextFilterValue);
    }
  }, [
    column,
    debouncedColumnMinMaxFilterValue,
    debouncedColumnTextFilterValue,
    firstValue,
  ]);

  return typeof firstValue === "number" ? (
    <Flex columnGap={2}>
      <Input
        type="number"
        size="xs"
        placeholder={`Min ${
          columnFacetedMinValue ? `(${columnFacetedMinValue})` : ""
        }`}
        min={columnFacetedMinValue}
        max={columnFacetedMaxValue}
        value={minMaxInputValue?.[0] ?? ""}
        onChange={(e) =>
          setMinMaxInputValue((prev) => {
            const previousMaxNumber = prev?.[1];
            let value;
            if (e.target.value !== "") {
              value = Number(e.target.value);
            } else {
              value = undefined;
            }
            return [value, previousMaxNumber];
          })
        }
      />
      <Input
        type="number"
        size="xs"
        placeholder={`Max ${
          columnFacetedMaxValue ? `(${columnFacetedMaxValue})` : ""
        }`}
        min={columnFacetedMinValue}
        max={columnFacetedMaxValue}
        value={minMaxInputValue?.[1] ?? ""}
        onChange={(e) =>
          setMinMaxInputValue((prev) => {
            const previousMinNumber = prev?.[0];
            let value;
            if (e.target.value !== "") {
              value = Number(e.target.value);
            } else {
              value = undefined;
            }
            return [previousMinNumber, value];
          })
        }
      />
    </Flex>
  ) : (
    <Input
      type="text"
      size="xs"
      placeholder={`Filter value... (${column.getFacetedUniqueValues().size})`}
      variant="flushed"
      value={textInputValue}
      onChange={(e) => setTextInputValue(e.target.value)}
    />
  );
};

export default ColumnFilterInput;
