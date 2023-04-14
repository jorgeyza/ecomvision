import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ColumnsIcon, SearchIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import useDebounce from "~/utils/useDebounce";

interface Props {
  onSetGlobalFilter: Dispatch<SetStateAction<string>>;
  onToggleVisibilityPopover: () => void;
}

const DataGridOptions = ({
  onSetGlobalFilter,
  onToggleVisibilityPopover,
}: Props) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    onSetGlobalFilter(debouncedValue);
  }, [debouncedValue, onSetGlobalFilter]);

  return (
    <Flex justifyContent="space-between" alignItems="end" columnGap={2}>
      <Button
        leftIcon={<ColumnsIcon size={16} />}
        size="xs"
        variant="ghost"
        onClick={onToggleVisibilityPopover}
      >
        COLUMNS
      </Button>
      <InputGroup size="sm" maxWidth={250}>
        <Input
          borderRadius="md"
          value={value}
          variant="flushed"
          placeholder="Search table..."
          onChange={(e) => setValue(e.target.value)}
        />
        <InputRightElement marginRight={2}>
          <SearchIcon size={16} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default DataGridOptions;
