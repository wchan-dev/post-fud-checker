import { Box, Image, Flex, Heading, Text } from "@chakra-ui/react";

const Banner = () => {
  return (
    <Box p={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex direction="column" justifyContent="center">
          <Heading as="h1" size="lg">
            Reddit Sentiment Analyzer
          </Heading>
          <Text mt={2}>
            Welcome to the Reddit Sentiment Analyzer! This tool allows you to
            analyze the sentiment of Reddit comments in a specific thread.
            Discover the overall sentiment and dive into the data today.
          </Text>
        </Flex>
        <Box boxSize="100px">
          {/* Replace the src with your actual logo image */}
          <Image src="/path/to/your/logo.png" alt="Logo" />
        </Box>
      </Flex>
    </Box>
  );
};

export default Banner;
