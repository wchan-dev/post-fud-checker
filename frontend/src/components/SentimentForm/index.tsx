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
    <Box width="100%">
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
          <Flex direction="row">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              fontSize="sm"
              flexGrow={3}
              placeholder="Paste Reddit Thread URL Here"
            />
            <Button
              colorScheme="blue"
              type="submit"
              fontSize="sm"
              minWidth={["100%", "140px"]} // Responsive width
              isLoading={isLoading}
              loadingText="Submitting..."
              mt={{ base: 2, md: 0 }}
            >
              Query
            </Button>
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
