import axios, { AxiosError } from "axios";

interface Comment {
  created_utc: string;
  post_title: string;
  summation_score: number;
  compound_score: number;
  comment_count_diff: number;
}

export type SentimentResult = {
  timeStamps: Date[];
  sentiments: number[];
  histogram_sentiments: number[];
  postTitle: string;
  submission_Date: Date;
  subreddit: string;
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
    console.log(timeStamps);
    const sentiments = response.data.comments.map(
      (comment: Comment) => comment.summation_score
    );

    const histogram_sentiments = response.data.comments.map(
      (comment: Comment) => comment.compound_score
    );

    const postTitle = response.data.post_title;
    const submission_Date = response.data.submission_date;
    const subreddit = response.data.subreddit;

    return {
      timeStamps,
      postTitle,
      sentiments,
      histogram_sentiments,
      submission_Date,
      subreddit,
    };
  } catch (error: any) {
    return {
      timeStamps: [],
      sentiments: [],
      histogram_sentiments: [],
      postTitle: "",
      submission_Date: new Date(),
      subreddit: "",
      error: error.message,
    };
  }
};
