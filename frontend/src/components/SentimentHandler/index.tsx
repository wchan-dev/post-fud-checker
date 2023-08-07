import { useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
} from "@chakra-ui/react";
import CommentsTableContainer from "./CommentsTable";
import { Comment } from "../../api/getSentiment";
// import { MovingAveragePlot } from "./Plots/MovingAverage";
import { SentimentTimelinePlot } from "./Plots/SentimentTimeLine";
import { SentimentDistributionPlot } from "./Plots/SentimentDistrubtion";
import { SentimentsAveragePlot } from "./Plots/SentimentAveraged";

interface SentimentHandlerProps {
  postTitle: string;
  subreddit: string;
  submissionDate: Date;
  sentimentBaseline: number;
  sentiments_compound: number[];
  timeStamps: Date[];
  sentiments_MovAvg: number[];
  timeStamps_MovAvg: Date[];
  sentiments_Avg: number[];
  timeStamps_Avg: Date[];
  bestComments: Comment[];
  controversialComments: Comment[];
}

const SentimentHandler: React.FC<SentimentHandlerProps> = ({
  postTitle,
  subreddit,
  submissionDate,
  sentimentBaseline,
  sentiments_compound,
  timeStamps,
  sentiments_MovAvg,
  timeStamps_MovAvg,
  sentiments_Avg,
  timeStamps_Avg,
  bestComments,
  controversialComments,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <Box
      p={4}
      gap={4}
      border="1px"
      borderRadius="xl"
      borderColor="gray.300"
      width="100%"
      ml="auto"
      mr="auto"
    >
      <Tabs
        variant="soft-rounded"
        size="sm"
        onChange={(index) => setSelectedTab(index)}
      >
        <TabList mb="1em">
          <Tab>Sentiments Averaged</Tab>
          <Tab>Sentiment Timeline</Tab>
          <Tab>Distribution of Comment Sentiments</Tab>
          <Tab>Best & Controversial Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel minHeight="50vH" key={selectedTab}>
            <SentimentsAveragePlot
              sentimentBaseline={sentimentBaseline}
              submissionDate={submissionDate}
              sentiments_Avg={sentiments_Avg}
              timeStamps_Avg={timeStamps_Avg}
            />
          </TabPanel>

          <TabPanel minHeight="50vH" key={selectedTab}>
            <SentimentTimelinePlot
              sentimentBaseline={sentimentBaseline}
              submissionDate={submissionDate}
              sentiments_compound={sentiments_compound}
              timeStamps={timeStamps}
            ></SentimentTimelinePlot>
          </TabPanel>
          <TabPanel minHeight="50vH" key={selectedTab}>
            <SentimentDistributionPlot
              sentiments_compound={sentiments_compound}
            ></SentimentDistributionPlot>
          </TabPanel>
          <TabPanel minHeight="50vH" overflowY="auto">
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
