import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const Banner = () => {
  return (
    <Box p={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex direction="column" justifyContent="center">
          <Flex justifyContent="flex-start">
            {" "}
            <Box boxSize="55px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#800080" // You can replace this with any purple hex color of your choice
              >
                <path d="M20 9a9 9 0 11-18 0 9 9 0 0118 0zM10 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm5.6-7.6l-1.34-1.34c-.45-.45-1.2-.45-1.66 0l-1.2 1.2c-.45-.07-.93-.2-1.4-.2-2.5 0-4.6 2.1-4.6 4.6s2 4.6 4.6 4.6c2.5 0 4.6-2.1 4.6-4.6 0-.47-.13-.94-.2-1.4l1.2-1.2c.46-.46.46-1.22 0-1.66zM11 11h-2v-2h2v2zm0-4h-2v2h2V7z" />
              </svg>
            </Box>
            <Heading as="h1" size="lg">
              Reddit Sentiment Analyzer
            </Heading>
          </Flex>
          <Text mt={2}>
            Welcome to the Reddit Sentiment Analyzer! This tool allows you to
            analyze the sentiment of Reddit comments in a specific thread.
            Discover the overall sentiment and dive into the data today.
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Banner;
