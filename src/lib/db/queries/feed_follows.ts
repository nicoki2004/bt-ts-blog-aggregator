
import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeedFollows(
	userId: string,
	feedId: string,
) {
	const [result] = await db
		.insert(feedFollows)
		.values({
			userId,
			feedId,
		})
		.returning();

	return getFeedFollows(result.userId, result.feedId)
}

export async function getFeedFollows(userId: string, feedId: string) {
	const result = await db
		.select({
			user: users,
			feed: feeds,
			follow: feedFollows,
		})
		.from(feedFollows)
		.innerJoin(users, eq(feedFollows.userId, users.id))
		.innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
		.where(
			and(eq(feedFollows.userId, userId),
				eq(feedFollows.feedId, feedId)
			)
		);

	return firstOrUndefined(result);
}


export async function getFeedFollowsFromUser(userId: string) {
	const result = await db
		.select({
			user: users,
			feed: feeds,
			follow: feedFollows,
		})
		.from(feedFollows)
		.innerJoin(users, eq(feedFollows.userId, users.id))
		.innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
		.where(
			eq(feedFollows.userId, userId),
		);

	return result;
}


export async function deleteFeedFromUser(user_id: string, feed_id: string) {
	await db.delete(feedFollows).where(
		and(
			eq(feedFollows.userId, user_id),
			eq(feedFollows.feedId, feed_id)
		)
	)
}
