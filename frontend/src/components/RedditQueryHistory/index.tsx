import React, { useContext, useEffect, useMemo } from "react";
import { useTable, useSortBy, Column } from "react-table";
import { Box, Link, useColorModeValue } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr, Text } from "@chakra-ui/react";
import { HistoryContext } from "./HistoryContext";

interface HistoryRecord {
  queryDate: string;
  subreddit: string;
  postTitle: string;
  postURL: string;
  numComments: number;
  overallSentiment: number | null;
  postDate: string;
}

const QueryHistoryContainer: React.FC = () => {
  const [historyList, setHistoryList] = useContext(HistoryContext);

  const linkColor = useColorModeValue("brand.link", "brand.link");

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
  //Listen for changes to 'historyList' in localStorage
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "historyList") {
        setHistoryList(JSON.parse(e.newValue || "[]"));
      }
    }
    window.addEventListener("storage", handleStorageChange);

    //Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setHistoryList]);

  const data = useMemo(() => historyList, [historyList]);

  const columns: Column<HistoryRecord>[] = useMemo(
    () => [
      {
        Header: "Query No.",
        accessor: (row, i) => i + 1,
        id: "queryNo",
      },
      {
        Header: "Query Date",
        accessor: (row) => formatDateString(new Date(row.queryDate)),
        id: "queryDate",
      },
      {
        Header: "Subreddit",
        accessor: "subreddit",
      },
      {
        Header: "Post Title",
        accessor: "postTitle",
        Cell: ({ value, row: { original } }) => (
          <Link
            href={original.postURL}
            color={linkColor}
            isExternal
            _hover={{ textDecoration: "underline" }}
          >
            {value}
          </Link>
        ),
      },
      {
        Header: "Number of Comments",
        accessor: "numComments",
      },
      {
        Header: "Overall Sentiment",
        accessor: "overallSentiment",
        Cell: ({ value }) => {
          const [text, color] = sentimentScoreToText(value);
          return <Text color={color}>{text}</Text>;
        },
      },
      {
        Header: "Post Created",
        accessor: (row) => formatDateString(new Date(row.postDate)),
        id: "postDate",
      },
    ],
    [linkColor]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Box
      maxHeight="30vH"
      minWidth="864px"
      marginTop="20px"
      pr="8px"
      pl="8px"
      overflowY="scroll"
    >
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

export default QueryHistoryContainer;
