import { useEffect, useState, useContext } from "react";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import CommentSentimentPlot from "./SentimentPlot";
import { Comment } from "./getSentiment";
import CommentsTableContainer from "./CommentsTable";

interface SentimentHandlerProps {
  timeStamps: Date[];
  sentiments: number[];
  histogramSentiments: number[];
  postTitle: string;
  sentimentBaseline: number;
  submissionDate: Date;
  subreddit: string;
  movingAverageSentiments: number[];
  movingAverageTimes: Date[];
  bestComments: Comment[];
  controversialComments: Comment[];
}

const SentimentHandler: React.FC<SentimentHandlerProps> = ({
  timeStamps,
  sentiments,
  histogramSentiments,
  postTitle,
  sentimentBaseline,
  submissionDate,
  subreddit,
  movingAverageSentiments,
  movingAverageTimes,
  bestComments,
  controversialComments,
}) => {
  return (
    <Box display="flex" flexDirection="column" mb={8} p={8} gap={4}>
      <CommentSentimentPlot
        timeStamps={timeStamps}
        sentiments={sentiments}
        histogram_sentiments={histogramSentiments}
        postTitle={postTitle}
        subreddit={subreddit}
        submissionDate={submissionDate}
        sentimentBaseline={sentimentBaseline}
        movingAverageSentiments={movingAverageSentiments}
        movingAverageTimes={movingAverageTimes}
        style={{ order: 2 }}
      ></CommentSentimentPlot>
      <Flex flexDirection="row" justifyContent="space-between" gap={4} mb={8}>
        <Stack flex="1">
          <Heading size="small">Top 5 Best Comments</Heading>
          <CommentsTableContainer
            comments={bestComments}
          ></CommentsTableContainer>
        </Stack>
        <Stack flex="1">
          <Heading size="small">Top 5 Most Controversial Comments</Heading>
          <CommentsTableContainer
            comments={controversialComments}
          ></CommentsTableContainer>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SentimentHandler;
