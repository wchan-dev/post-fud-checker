// import getSentiment from "./getSentiment";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
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

  const redditUrlPattern = new RegExp(
    "^(https?://)?(www.)?reddit.com/r/\\w+/comments/\\w+.*$",
    "i"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(inputValue);
    if (redditUrlPattern.test(inputValue)) {
      await handleGetSentiment("api/sentiment_analysis", inputValue);
      console.log("will send request to API");
    } else {
      console.log("incorrect, will not send request to api");
    }
  };

  const isValidUrl = redditUrlPattern.test(inputValue) || inputValue === "";

  return (
    <Box display="flex" justifyContent="flex-start">
      <form onSubmit={handleSubmit}>
        <FormControl isRequired isInvalid={!isValidUrl}>
          {isValidUrl ? (
            <FormHelperText fontSize="xs" ml="4px" mb="4px">
              Paste Reddit Thread URL Here
            </FormHelperText>
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
            />
            <Button type="submit" fontSize="xs">
              Submit
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Box>
  );
};

export default CommentSentimentForm;
