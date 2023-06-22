import { Box, Stack } from "@chakra-ui/react";
const TestComponent: React.FC = () => {
  return (
    <Box border="1px" borderColor="red">
      <Stack>
        <p>This is Test Component</p>
      </Stack>
    </Box>
  );
};

export default TestComponent;
