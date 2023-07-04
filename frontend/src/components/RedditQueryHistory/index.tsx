import {
  Box,
  Link,
  Table,
  Tbody,
  TableContainer,
  Td,
  Thead,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useContext } from "react";
import { HistoryContext } from "./HistoryContext";

export const QueryHistoryContainer: React.FC = () => {
  const [historyList, setHistoryList] = useContext(HistoryContext);

  const formatDateString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <Box maxWidth="100%" overflow="wrap" marginTop="20px" pr="8px" pl="8px">
      <TableContainer>
        <Table variant="striped" fontSize="sm">
          <Thead>
            <Tr>
              <Th textAlign="center">Query No.</Th>
              <Th textAlign="center">Post Title</Th>
              <Th textAlign="center">Number of Comments</Th>
              <Th textAlign="center"> Overall Sentiment</Th>
              <Th textAlign="center">Post Created Date</Th>
              <Th textAlign="center">Query Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyList.map((history, index) => (
              <Tr key={index}>
                <Td textAlign="center">{index + 1}</Td>
                <Td
                  textAlign="center"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  <Link
                    href={history.postURL}
                    color="blue.500"
                    isExternal
                    _hover={{ textDecoration: "underline" }}
                  >
                    {history.postTitle}
                  </Link>
                </Td>
                <Td textAlign="center" maxW="80px">
                  {history.numComments}
                </Td>
                <Td textAlign="center">
                  {history.overallSentiment.toFixed(2)}
                </Td>
                <Td textAlign="center">
                  {formatDateString(new Date(history.postDate))}
                </Td>
                <Td textAlign="center">
                  {formatDateString(new Date(history.queryDate))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
