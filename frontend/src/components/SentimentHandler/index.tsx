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
import CommentsTableContainer from "./CommentsTable";
import { Comment } from "../../api/getSentiment";

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
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <Box p={4} gap={4} border="1px" borderRadius="xl" borderColor="gray.300">
      <Tabs
        width="100%"
        variant="soft-rounded"
        size="sm"
        onChange={(index) => setSelectedTab(index)}
      >
        <TabList mb="1em">
          <Tab>Sentiment Moving Average</Tab>
          <Tab>Sentiment Timeline</Tab>
          <Tab>Distribution of Comment Sentiments</Tab>
          <Tab>Best & Controversial Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel height="55vH" minWidth="70vW">
            <CommentSentimentPlot
              key={selectedTab}
              timeStamps={timeStamps}
              sentiments={sentiments}
              histogram_sentiments={histogramSentiments}
              postTitle={postTitle}
              subreddit={subreddit}
              submissionDate={submissionDate}
              sentimentBaseline={sentimentBaseline}
              movingAverageSentiments={movingAverageSentiments}
              movingAverageTimes={movingAverageTimes}
              plotType="line"
            ></CommentSentimentPlot>
          </TabPanel>
          <TabPanel height="55vH" minWidth="70vW">
            <CommentSentimentPlot
              key={selectedTab}
              timeStamps={timeStamps}
              sentiments={sentiments}
              histogram_sentiments={histogramSentiments}
              postTitle={postTitle}
              subreddit={subreddit}
              submissionDate={submissionDate}
              sentimentBaseline={sentimentBaseline}
              movingAverageSentiments={movingAverageSentiments}
              movingAverageTimes={movingAverageTimes}
              plotType="marker"
            ></CommentSentimentPlot>
          </TabPanel>
          <TabPanel height="55vH" minWidth="70vW">
            <CommentSentimentPlot
              key={selectedTab}
              timeStamps={timeStamps}
              sentiments={sentiments}
              histogram_sentiments={histogramSentiments}
              postTitle={postTitle}
              subreddit={subreddit}
              submissionDate={submissionDate}
              sentimentBaseline={sentimentBaseline}
              movingAverageSentiments={movingAverageSentiments}
              movingAverageTimes={movingAverageTimes}
              plotType="histogram"
            ></CommentSentimentPlot>
          </TabPanel>
          <TabPanel height="55vH" minWidth="70vW" overflowY="auto">
            <VStack gap={16}>
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
