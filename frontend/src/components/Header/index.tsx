import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Header = () => {
  // Set the background color to #FF4500 in light mode and to #1A202C (a dark blue) in dark mode
  // #322b6a
  // #FDFD96
  const bgColor = useColorModeValue("#FF4500", "#322b6a");

  return (
    <Box p={4} bg={bgColor} color="white" mb={-4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Stack>
          <Flex justifyContent="flex-start" alignItems="center">
            <Box boxSize="45px">
              <Image
                src="../../../public/Reddit_Mark_OnWhite.png"
                boxSize="100%"
                alt="Someone Deleted the art lol"
              />
            </Box>
            <Heading as="h1" size="lg" ml={2}>
              reddit sentiment analyzer
            </Heading>
          </Flex>
          <Box width="70%">
            <Text fontSize="sm">
              Ever wonder why you feel down after doom scrolling through a whole
              Reddit thread? Look no further! Welcome to the Reddit Sentiment
              Analyzer, a tool that visualizes the actual sentiment of Reddit
              comments in a thread. Analyze the sentiment, gain insights, and
              discover the emotional tone of the discussion. Stop doom scrolling
              today.
            </Text>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;
