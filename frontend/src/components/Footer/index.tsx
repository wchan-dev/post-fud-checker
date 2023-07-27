import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box maxHeight="5vH" p={2} bg="gray.800" color="gray.50">
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
          <Box ml={4} width="70%">
            <Text fontSize="sm">
              &copy; {new Date().getFullYear()} Reddit Sentiment Analyzer. All
              rights reserved.
            </Text>
          </Box>
        </Flex>
        <Flex direction="column" justifyContent="center">
          <Text fontSize="sm">
            <Link href="#" color="white">
              Terms of Service
            </Link>
          </Text>
          <Text fontSize="sm">
            <Link href="#" color="white">
              Privacy Policy
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
