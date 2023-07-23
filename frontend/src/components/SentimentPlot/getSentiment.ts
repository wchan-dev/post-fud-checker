import axios from "axios";

interface CommentData {
  comment: {
    body: string;
    permalink: string;
    score: number;
    timestamp: Date;
  };

  sentiment: {
    compound: number;
    neg: number;
    neu: number;
    pos: number;
  };
}

export type SentimentResult = {
  timeStamps: Date[];
  sentiments_compound: number[];
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

    const data = response.data;

    const timeStamps = data.comments.map(
      (commentData: CommentData) => new Date(commentData.comment.timestamp)
    );

    const sentiments_compound = data.comments.map(
      (commentData: CommentData) => commentData.sentiment.compound
    );

    const histogram_sentiments = data.comments.map(
      (commentData: CommentData) => commentData.sentiment.compound
    );

    const postTitle = data.post_title;
    const submission_Date = data.submission_date;
    const subreddit = data.subreddit;

    return {
      timeStamps,
      postTitle,
      sentiments_compound,
      histogram_sentiments,
      submission_Date,
      subreddit,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
    return {
      timeStamps: [],
      sentiments_compound: [],
      histogram_sentiments: [],
      postTitle: "",
      submission_Date: new Date(),
      subreddit: "",
      error: error.message,
    };
  }
};
