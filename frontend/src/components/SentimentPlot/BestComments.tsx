import { Box } from "@chakra-ui/react";

interface CommentsTableProps {
  body: string;
  score: number;
  sentiment: number;
  permalink: string;
}

const CommentsTable: React.FC<CommentsTableProps> = ({
  body,
  score,
  sentiment,
  permalink,
}) => {
  return <Box></Box>;
};
