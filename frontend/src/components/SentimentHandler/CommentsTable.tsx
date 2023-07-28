import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTable, useSortBy, Column as TableColumn } from "react-table";
import { Comment } from "../../api/getSentiment";
import { sentimentScoreToText } from "../../utils/sentimentUtils";

interface CommentsTableContainerProps {
  comments: Comment[];
}

const ExpandableContent: React.FC<{
  text: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ text, expanded, onToggle }) => (
  <Flex direction="row" align="start" justify="space-between">
    <Text>{expanded ? text : `${text.substring(0, 65)}...`}</Text>
    {text.length > 65 && (
      <Text ml={4} onClick={onToggle} cursor="pointer" color="blue.500">
        {expanded ? "-" : "+"}
      </Text>
    )}
  </Flex>
);

const CommentsTableContainer: React.FC<CommentsTableContainerProps> = ({
  comments,
}) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const handleExpand = (rowIndex: number) => {
    setExpandedRows((prevRows) =>
      prevRows.includes(rowIndex)
        ? prevRows.filter((i) => i !== rowIndex)
        : [...prevRows, rowIndex]
    );
  };
  const columns: TableColumn<Comment>[] = useMemo(
    () => [
      {
        Header: "Score",
        accessor: "score",
        Cell: ({ value }: { value: string }) => (
          <Box textAlign="center">
            <Text as="b">{value}</Text>
          </Box>
        ),
      },
      {
        Header: "Content",
        accessor: "body",
        maxWidth: 50,
        Cell: ({
          value,
          row: { original, index },
        }: {
          value: string;
          row: { original: Comment; index: number };
        }) => (
          <Box style={{ maxWidth: "515px" }}>
            <ExpandableContent
              text={value}
              expanded={expandedRows.includes(index)}
              onToggle={() => handleExpand(index)}
            />
          </Box>
        ),
      },
      {
        Header: "Sentiment",
        accessor: "sentiment",
        Cell: ({ value }: { value: number | null }) => {
          const [text, color] = sentimentScoreToText(value);
          return (
            <Box textAlign="center">
              <Text color={color}>{text}</Text>
            </Box>
          );
        },
      },
    ],
    [expandedRows]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: comments }, useSortBy);

  return (
    <Box>
      <Table {...getTableProps()} size="sm">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  textAlign="center"
                  style={{ cursor: "pointer" }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "" : "") : ""}
                  </span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    {...cell.getCellProps()}
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommentsTableContainer;
