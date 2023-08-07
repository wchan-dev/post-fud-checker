import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  Spinner,
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
    <Box width="80%" mb={2}>
      <form onSubmit={handleSubmit}>
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
              Invalid Reddit Thread URL
            </FormErrorMessage>
          )}
          <Flex direction="row" gap={2}>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              fontSize="xs"
              size="xs"
              borderRadius="lg"
              borderColor="gray.300"
              flexGrow={2}
              placeholder="Paste Reddit Thread URL Here"
            />
            {isLoading ? (
              <Spinner color="blue.500" />
            ) : (
              <Button colorScheme="blue" type="submit" fontSize="xs" size="xs">
                Query
              </Button>
            )}{" "}
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
