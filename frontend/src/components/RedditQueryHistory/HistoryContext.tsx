import { createContext, Dispatch, SetStateAction } from "react";

export type History = {
  subreddit: string;
  postTitle: string;
  postURL: string;
  numComments: number;
  overallSentiment: number;
  postDate: Date;
  queryDate: Date;
};

export const HistoryContext = createContext<
  [History[], Dispatch<SetStateAction<History[]>>]
>([
  [],
  () => {
    throw new Error("HistoryContext used without Provider");
  },
]);
