import { useEffect, useState, useContext } from "react";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
} from "@chakra-ui/react";
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
    <Box mb={8} p={8} gap={4}>
      <Tabs
        border="1px"
        borderColor="gray.300"
        width="100%"
        isFitted
        variant="enclosed"
      >
        <TabList mb="1em">
          <Tab>Sentiment Plot</Tab>
          <Tab>Best & Controversial Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel minHeight="55vH" minWidth="70vW">
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
          </TabPanel>
          <TabPanel minHeight="55vH" minWidth="70vW">
            <VStack>
              <Stack>
                <Heading size="small">Top 5 Best Comments</Heading>
                <CommentsTableContainer
                  comments={bestComments}
                ></CommentsTableContainer>
              </Stack>
              <Stack>
                <Heading size="small">
                  Top 5 Most Controversial Comments
                </Heading>
                <CommentsTableContainer
                  comments={controversialComments}
                ></CommentsTableContainer>
              </Stack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SentimentHandler;
