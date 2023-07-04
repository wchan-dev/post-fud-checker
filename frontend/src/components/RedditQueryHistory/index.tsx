import {
  Box,
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
  return (
    <Box maxWidth="100%" overflow="wrap" marginTop="20px" pr="8px" pl="8px">
      <TableContainer>
        <Table variant="striped" fontSize="sm">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Post Title</Th>
              <Th>Number of Comments</Th>
              <Th> Overall Sentiment</Th>
              <Th>Post Created Date</Th>
              <Th>Query Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyList.map((history, index) => (
              <Tr>
                <Td>{index}</Td>
                <Td>
                  <a href={history.postURL}>{history.postTitle}</a>
                </Td>
                <Td>{history.numComments}</Td>
                <Td>{history.overallSentiment}</Td>
                <Td>history.postDate</Td>
                <Td>history.queryDate</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
