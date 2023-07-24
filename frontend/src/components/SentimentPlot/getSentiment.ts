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

interface MovingSentimentData {
  current_time: Date;
  moving_average_sentiment: number;
}

export type SentimentResult = {
  timeStamps: Date[];
  sentiments_compound: number[];
  histogram_sentiments: number[];
  postTitle: string;
  submission_Date: Date;
  subreddit: string;
  sentimentBaseline: number;
  moving_average_sentiments: number[];
  moving_average_times: Date[];
  error?: string;
};

export const getSentiment = async (
  api_endpoint: string,
  reddit_url: string
): Promise<SentimentResult> => {
  try {
    const response = await axios.post(
      api_endpoint,
      { reddit_url: reddit_url },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;

    const timeStamps = data.comments.map((commentData: CommentData) => {
      const date = new Date(commentData.comment.timestamp);
      const utcDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return utcDate;
    });

    const sentiments_compound = data.comments.map(
      (commentData: CommentData) => commentData.sentiment.compound
    );

    const histogram_sentiments = data.comments.map(
      (commentData: CommentData) => commentData.sentiment.compound
    );

    const moving_average_sentiments = data.moving_sentiment_average.map(
      (movingSentimentData: MovingSentimentData) =>
        movingSentimentData.moving_average_sentiment
    );

    console.log("from getting sentiment...");
    console.log(moving_average_sentiments);

    const moving_average_times = data.moving_sentiment_average.map(
      (movingSentimentData: MovingSentimentData) => {
        const date = new Date(movingSentimentData.current_time);
        const utcDate = new Date(
          date.getTime() + date.getTimezoneOffset() * 60000
        );
        return utcDate;
      }
    );

    const postTitle = data.post_title;
    const submission_Date = new Date(data.submission_date);
    const utcSubmissionDate = new Date(
      submission_Date.getTime() + submission_Date.getTimezoneOffset() * 60000
    );
    const subreddit = data.subreddit;
    const sentimentBaseline = data.sentiment_baseline;

    return {
      timeStamps,
      postTitle,
      sentiments_compound,
      histogram_sentiments,
      submission_Date: utcSubmissionDate,
      subreddit,
      sentimentBaseline,
      moving_average_sentiments,
      moving_average_times,
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
      sentimentBaseline: 0,
      moving_average_sentiments: [],
      moving_average_times: [],
      error: error.message,
    };
  }
};
