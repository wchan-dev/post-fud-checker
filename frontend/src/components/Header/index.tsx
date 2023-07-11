import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box p={4} bg="#FF4500" color="white">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex direction="column" justifyContent="center">
          <Flex justifyContent="flex-start" alignItems="center">
            <Box boxSize="55px">
              <Image
                src="../../../public/reddit-alien-default.png"
                boxSize="100%"
                alt="Someone Deleted the art lol"
              />
            </Box>
            <Heading as="h1" size="lg">
              reddit sentiment analyzer
            </Heading>
          </Flex>
          <Box width="60%">
            <Text fontSize="sm">
              Ever wonder why you feel down after doom scrolling through a whole
              Reddit thread? Look no further! Welcome to the Reddit Sentiment
              Analyzer, a tool that visualizes the actual sentiment of Reddit
              comments in a thread. Analyze the sentiment, gain insights, and
              discover the emotional tone of the discussion. Stop doom scrolling
              today.
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
