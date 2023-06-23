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

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      w={{ base: "50%", sm: "70%", md: "30%" }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl
          isRequired
          isInvalid={!redditUrlPattern.test(inputValue) && inputValue !== ""}
        >
          <FormHelperText fontSize="xs">
            {redditUrlPattern.test(inputValue) ? (
              <FormHelperText> Paste Reddit Post Link here</FormHelperText>
            ) : (
              <FormErrorMessage>Invalid Reddit Thread URL</FormErrorMessage>
            )}
          </FormHelperText>
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
