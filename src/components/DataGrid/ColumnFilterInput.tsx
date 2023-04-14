import { Input } from "@chakra-ui/react";
import { type Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import useDebounce from "~/utils/useDebounce";

interface Props<T extends object> {
  column: Column<T, unknown>;
}

const ColumnFilterInput = <T extends object>({ column }: Props<T>) => {
  const [value, setValue] = useState("");

  const debouncedColumnFilterValue = useDebounce<unknown>(value, 500);

  useEffect(() => {
    column.setFilterValue(debouncedColumnFilterValue);
  }, [column, debouncedColumnFilterValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Filter value... (${column.getFacetedUniqueValues().size})`}
      size="xs"
      variant="flushed"
    />
  );
};

export default ColumnFilterInput;
