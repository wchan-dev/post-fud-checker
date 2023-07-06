// import getSentiment from "./getSentiment";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  handleGetSentiment: (
    api_endpoint: string,
    reddit_url: string
  ) => Promise<void>;
}

const CommentSentimentForm: React.FC<Props> = ({ handleGetSentiment }) => {
  const [inputValue, setInputValue] = useState<string | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      await handleGetSentiment("api/sentiment_analysis", inputValue);
      setIsLoading(false);
    } else {
      console.log("invalid reddit url");
    }
  };

  const isValidUrl = redditUrlPattern.test(inputValue) || inputValue === "";

  return (
    <Box ml={-4} width="100%" display="flex" justifyContent="flex-start">
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
          <Flex direction={{ base: "column", md: "row" }} gap={3}>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              fontSize="sm"
              placeholder="Paste Reddit Thread URL Here"
            />
            <Button
              minWidth={["100%", "140px"]} // Responsive width
              type="submit"
              fontSize="sm"
              isLoading={isLoading}
              loadingText="Submitting..."
            >
              Submit
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Box>
  );
};

export default CommentSentimentForm;
