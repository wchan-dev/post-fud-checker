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
  postTitle: string;
  submissionDate: Date;
  subreddit: string;
  sentimentBaseline: number;
  sentiments_compound: number[];
  timeStamps: Date[];
  sentiments_MovAvg: number[];
  timeStamps_MovAvg: Date[];
  bestComments: Comment[];
  controversialComments: Comment[];
  error?: string;
};

export async function getSentiment(
  api_endpoint: string,
  reddit_url: string
): Promise<SentimentResult> {
  try {
    const response = await axios.post(
      api_endpoint,
      { reddit_url: reddit_url },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;

    const postTitle = data.post_title;
    const subreddit = data.subreddit;
    const submission_date_local = new Date(data.submission_date);
    const submissionDate = new Date(
      submission_date_local.getTime() +
        submission_date_local.getTimezoneOffset() * 60000
    ) as Date;

    const sentimentBaseline = data.sentiment_baseline;

    const sentiments_compound = data.comments.map(
      (commentData: CommentData) => commentData.sentiment.compound
    );

    const timeStamps = data.comments.map((commentData: CommentData) => {
      const date = new Date(commentData.comment.timestamp);
      const utcDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return utcDate;
    });

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

    movingSentimentDataArray.sort(
      (a: { current_time: Date }, b: { current_time: Date }) =>
        a.current_time.getTime() - b.current_time.getTime()
    );

    const sentiments_MovAvg = movingSentimentDataArray.map(
      (movingAvg: MovingSentimentData) => movingAvg.moving_average_sentiment
    );

    const timeStamps_MovAvg = movingSentimentDataArray.map(
      (movingAvg: MovingSentimentData) => movingAvg.current_time
    );

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
      postTitle,
      subreddit,
      submissionDate,
      sentimentBaseline,
      timeStamps,
      sentiments_compound,
      sentiments_MovAvg,
      timeStamps_MovAvg,
      bestComments,
      controversialComments,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
    return {
      postTitle: "",
      subreddit: "",
      submissionDate: new Date(),
      sentimentBaseline: 0,
      sentiments_compound: [] as number[],
      timeStamps: [] as Date[],
      sentiments_MovAvg: [] as number[],
      timeStamps_MovAvg: [] as Date[],
      bestComments: [] as Comment[],
      controversialComments: [] as Comment[],
      error: error.message,
    };
  }
}
