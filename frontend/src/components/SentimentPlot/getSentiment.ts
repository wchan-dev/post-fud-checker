import axios, { AxiosError } from "axios";

interface Props {}
interface Comment {
  created_utc: string;
  summation_score: number;
  comment_count_diff: number;
}

const getSentiment = (api_endpoint: string, reddit_url: any) => {
  axios
    .post(api_endpoint, reddit_url)
    .then((response) => {
      const timeStamps = response.data.comments.map(
        (comment: Comment) => new Date(comment.created_utc)
      );
      const scores = response.data.comments.map(
        (comment: Comment) => comment.summation_score
      );
      setPostTitle(response.data.post);
      setTimeStamps(timeStamps);
      setSentiments(scores);
      setCommentCountDiff(response.data.comment_count_diff);
      setLoading(false);
      const respURL = response.data.postURL;
      setPostURL(respURL);
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
};

export default getSentiment;
