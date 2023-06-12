import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Plot from "react-plotly.js";

interface CommentSentimentPlotProps {
  timeStamps: Date[];
  sentiments: number[];
}
const CommentSentimentPlot: React.FC<CommentSentimentPlotProps> = ({
  timeStamps,
  sentiments,
}) => {
  if (timeStamps.length === 0 || sentiments.length === 0) {
    return <p>No data to display</p>;
  }
  const data = [
    { x: timeStamps, y: sentiments, mode: "markers", type: "scatter" },
  ];
  const layout = {
    title: "Comment Sentiment Over Time",
    xaxis: { title: "Time", showgrid: true, zeroline: true },
    yaxis: { title: "Sentiment", showline: true },
  };
  return (
    <Box w="100%" display="flex" alignItems="center" justifyContent="center">
      <Plot data={data} layout={layout} />
    </Box>
  );
};

interface Comment {
  comment_timestamp: string;
  summation_score: number;
}

const CommentSentimentForm: React.FC = () => {
  const [postURL, setPostURL] = useState<string>("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [postTitle, setPostTitle] = useState();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const [loading, setLoading] = useState(false);
  const getSentiment = (url: string) => {
    console.log(postURL);
    setLoading(true);
    const data = { postURL };
    axios
      .post(url, data)
      .then((response) => {
        const timeStamps = response.data.comments.map(
          (comment: Comment) => new Date(comment.comment_timestamp)
        );
        const scores = response.data.comments.map(
          (comment: Comment) => comment.summation_score
        );
        setPostTitle(response.data.post);
        setTimeStamps(timeStamps);
        setSentiments(scores);
        setLoading(false);
        const respURL = response.data.postURL;
        setPostURL(respURL);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getInitial = () => {
    getSentiment(`/api/sentiment_analysis/initial`);
    sessionStorage.setItem("initialPostFetched", "true");
  };

  const handleClick = () => {
    getSentiment(`/api/sentiment_analysis`);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("initialPostFetched")) {
      getInitial();
      sessionStorage.setItem("initialPostFetched", "true");
    }
  }, []);
  return (
    <Box display="flex" alignItems="center" mr="auto" ml="auto">
      <Stack direction={"column"} align="center">
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Box w="100%">
            <Link href={postURL} isExternal>
              <Heading size="sm">{postTitle}</Heading>
            </Link>
            <CommentSentimentPlot
              timeStamps={timeStamps}
              sentiments={sentiments}
            />
          </Box>
        )}
        <Center>
          <form onSubmit={handleSubmit}></form>
          <Input
            maxW="320px"
            type="text"
            value={postURL}
            onChange={(event) => setPostURL(event.target.value)}
          />
          <Button maxW="128px" ml="8px" onClick={handleClick}>
            Analyze
          </Button>
        </Center>
      </Stack>
    </Box>
  );
};

export default CommentSentimentForm;
