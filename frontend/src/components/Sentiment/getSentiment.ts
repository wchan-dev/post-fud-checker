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

export interface Comment {
  body: string;
  score: number;
  sentiment: number;
  permalink: string;
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
  bestComments: Comment[];
  controversialComments: Comment[];
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

    const movingSentimentDataArray = data.moving_sentiment_average.map(
      (movingSentimentData: MovingSentimentData) => {
        return {
          moving_average_sentiment:
            movingSentimentData.moving_average_sentiment,
          current_time: new Date(
            new Date(movingSentimentData.current_time).getTime() +
              new Date(movingSentimentData.current_time).getTimezoneOffset() *
                60000
          ),
        };
      }
    );

    movingSentimentDataArray.sort((a, b) => a.current_time - b.current_time);

    const moving_average_sentiments = movingSentimentDataArray.map(
      (data) => data.moving_average_sentiment
    );

    const moving_average_times = movingSentimentDataArray.map(
      (data) => data.current_time
    );

    const postTitle = data.post_title;
    const submission_Date = new Date(data.submission_date);
    const utcSubmissionDate = new Date(
      submission_Date.getTime() + submission_Date.getTimezoneOffset() * 60000
    );
    const subreddit = data.subreddit;
    const sentimentBaseline = data.sentiment_baseline;

    const bestComments = data.best_comments.map(
      (commentData: CommentData): Comment => {
        return {
          body: commentData.comment.body,
          score: commentData.comment.score,
          sentiment: commentData.sentiment.compound,
          permalink: commentData.comment.permalink,
        };
      }
    );

    const controversialComments = data.controversial_comments.map(
      (commentData: CommentData): Comment => {
        return {
          body: commentData.comment.body,
          score: commentData.comment.score,
          sentiment: commentData.sentiment.compound,
          permalink: commentData.comment.permalink,
        };
      }
    );

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
      bestComments,
      controversialComments,
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
      bestComments: [],
      controversialComments: [],
      error: error.message,
    };
  }
};
