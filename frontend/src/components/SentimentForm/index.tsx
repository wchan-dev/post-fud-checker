import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

type SentimentFormProps = {
  handleGetSentiment: (
    api_endpoint: string,
    reddit_url: string
  ) => Promise<void>;
  handleClearHistory: () => void;
};

const SentimentForm: React.FC<SentimentFormProps> = ({
  handleGetSentiment,
  handleClearHistory,
}) => {
  const [inputValue, setInputValue] = useState<string | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const redditUrlPattern = new RegExp(
    "^(https?://)?(www.)?reddit.com/r/\\w+/comments/\\w+.*$",
    "i"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (redditUrlPattern.test(inputValue)) {
      const error = await handleGetSentiment(
        "api/sentiment_analysis",
        inputValue
      );
      setIsLoading(false);
    } else {
      console.log("invalid reddit url");
    }
  };

  const isValidUrl = redditUrlPattern.test(inputValue) || inputValue === "";

  return (
    <Box
      mb={8}
      ml={-4}
      width="100%"
      display="flex"
      justifyContent="space-between"
    >
      <form onSubmit={handleSubmit} width="100%">
        <FormControl isRequired isInvalid={!isValidUrl}>
          {isValidUrl ? (
            <FormHelperText
              fontSize="xs"
              ml="4px"
              mb="4px"
              height="1.2em"
            ></FormHelperText>
          ) : (
            <FormErrorMessage fontSize="xs" ml="4px" mb="4px">
              {" "}
              Invalid Reddit Thread URL
            </FormErrorMessage>
          )}
          <Flex
            justifyContent={{ base: "space-between", md: "flex-start" }}
            alignItems={{ base: "stretch", md: "flex-start" }}
            gap={3}
            flexWrap="wrap"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              fontSize="sm"
              placeholder="Paste Reddit Thread URL Here"
            />
            <Flex
              direction="row"
              gap={4}
              justifyContent="space-between"
              width="60%"
            >
              <Button
                colorScheme="blue"
                minWidth={["100%", "140px"]} // Responsive width
                type="submit"
                fontSize="sm"
                isLoading={isLoading}
                loadingText="Submitting..."
                mt={{ base: 2, md: 0 }}
              >
                Submit
              </Button>
              <Button
                onClick={handleClearHistory}
                mt={{ base: 2, md: 0 }}
                fontSize="sm"
              >
                Clear History
              </Button>
            </Flex>
          </Flex>
          {apiError && (
            <Alert status="error" mt={4}>
              {apiError}
            </Alert>
          )}
        </FormControl>
      </form>
    </Box>
  );
};

export default SentimentForm;
