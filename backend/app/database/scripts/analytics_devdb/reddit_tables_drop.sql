-- reddit_tables_drop.sql

-- This SQL script drops the following tables in the "reddit" database along with their cascading dependencies:

-- Drop the "submission" table along with cascading dependencies
DROP TABLE reddit.submission CASCADE;

-- Drop the "comments" table along with cascading dependencies
DROP TABLE reddit.comments CASCADE;

-- Drop the "comment_sentiment" table
DROP TABLE reddit.comment_sentiment;

-- Drop the "submission_sentiment" table
DROP TABLE reddit.submission_sentiment;
