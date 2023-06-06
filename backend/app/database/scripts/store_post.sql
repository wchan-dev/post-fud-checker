CREATE OR REPLACE PROCEDURE reddit.store_post(IN post_title text, IN permalink text, IN submission_id text, IN selftext text, IN compound real, IN neg real, IN neu real, IN pos real, IN summation_score real, IN upvote_ratio real, IN post_timestamp timestamp with time zone)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
	INSERT INTO reddit.posts (post_title, permalink, submission_id,  selftext, compound, neg, neu, pos, summation_score, upvote_ratio, post_timestamp)
		VALUES (post_title, permalink, submission_id,  selftext, compound, neg, neu, pos, summation_score, upvote_ratio, num_comments post_timestamp);
END;