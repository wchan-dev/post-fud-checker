import { Box, Link } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTable, useSortBy, Column as TableColumn } from "react-table";
import { Comment } from "./getSentiment";

interface CommentsTableContainerProps {
  comments: Comment[];
}

const sentimentScoreToText = (score: number | null): [string, string] => {
  if (score === null) return ["N/A", "Gray"];
  if (score <= -60) return ["Very Negative", "DarkRed"];
  if (score <= -20) return ["Negative", "Red"];
  if (score <= -3) return ["Slightly Negative", "LightRed"];
  if (score >= -2 && score <= 2) return ["Neutral", "Gray"];
  if (score <= 20) return ["Slightly Positive", "LightGreen"];
  if (score <= 60) return ["Positive", "Green"];
  return ["Very Positive", "DarkGreen"];
};

const CommentsTableContainer: React.FC<CommentsTableContainerProps> = ({
  comments,
}) => {
  const columns: TableColumn<Comment>[] = useMemo(
    () => [
      {
        Header: "Score",
        accessor: "score",
      },
      {
        Header: "Content",
        accessor: "body",
        Cell: ({
          value,
          row: { original },
        }: {
          value: string;
          row: { original: Comment };
        }) => (
          <Link href={original.permalink} isExternal>
            {value}
          </Link>
        ),
      },
      {
        Header: "Sentiment",
        accessor: "sentiment",
        Cell: ({ value }: { value: number | null }) => {
          const [text, color] = sentimentScoreToText(value);
          return <Text color={color}>{text}</Text>;
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: comments }, useSortBy); // Here use 'comments' instead of 'data'

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
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
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
                  <Td {...cell.getCellProps()} textAlign="center">
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
