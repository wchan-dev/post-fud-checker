import React, { useContext, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Box, Link, useColorModeValue } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { HistoryContext } from "./HistoryContext";

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

  const columns = useMemo(
    () => [
      {
        Header: "Query No.",
        accessor: (row: any, i: number) => i + 1,
        id: "queryNo",
      },
      {
        Header: "Query Date",
        accessor: (row: any) => formatDateString(new Date(row.queryDate)),
        id: "queryDate",
      },
      {
        Header: "Subreddit",
        accessor: "subreddit",
      },
      {
        Header: "Post Title",
        accessor: "postTitle",
        Cell: ({ value, row: { original } }: any) => (
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
        Cell: ({ value }: any) => (value ? value.toFixed(2) : "N/A"),
      },
      {
        Header: "Post Created",
        accessor: (row: any) => formatDateString(new Date(row.postDate)),
        id: "postDate",
      },
    ],
    [linkColor]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Box minWidth="864px" marginTop="20px" pr="8px" pl="8px">
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
