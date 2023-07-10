import React, {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

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

interface HistoryProviderProps {
  children: React.ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
}) => {
  // Initialize state with localStorage value
  const [historyList, setHistoryList] = useState<History[]>(() => {
    const localData = localStorage.getItem("historyList");
    return localData ? JSON.parse(localData) : [];
  });

  // Sync state with localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  return (
    <HistoryContext.Provider value={[historyList, setHistoryList]}>
      {children}
    </HistoryContext.Provider>
  );
};
