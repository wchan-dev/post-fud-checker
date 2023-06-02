import { Box, Flex } from "@chakra-ui/react";
import CommentSentimentForm from "../PlotMisc";

const MainContent = () => {
  return (
    <Box w="100%">
      <Flex min-width="max-content" alignItems="center">
        <CommentSentimentForm></CommentSentimentForm>
      </Flex>
    </Box>
  );
};

export default MainContent;
