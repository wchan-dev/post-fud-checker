import axios, { AxiosError } from "axios";

interface Comment {
  created_utc: string;
  post_title: string;
  summation_score: number;
  comment_count_diff: number;
}

export type SentimentResult = {
  timeStamps: Date[];
  sentiments: number[];
  postTitle: string;
  error?: string;
};

export const getSentiment = async (
  api_endpoint: string,
  reddit_url: string
): Promise<SentimentResult> => {
  try {
    const response = await axios.post(
      "api/sentiment_analysis",
      { reddit_url: reddit_url },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const timeStamps = response.data.comments.map(
      (comment: Comment) => new Date(comment.created_utc)
    );
    const sentiments = response.data.comments.map(
      (comment: Comment) => comment.summation_score
    );
    const postTitle = response.data.post_title;

    return { timeStamps, sentiments, postTitle };
  } catch (error: any) {
    return {
      timeStamps: [],
      sentiments: [],
      postTitle: "",
      error: error.message,
    };
  }
};
