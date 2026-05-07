import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
	feedName: string,
	url: string,
	userId: string,
) {
	const result = await db
		.insert(feeds)
		.values({
			name: feedName,
			url,
			userId,
		})
		.returning();

	return firstOrUndefined(result);
}

export async function getFeeds() {
	return await db.select().from(feeds);
}

export async function getFeedByUrl(url: string) {
	const result = await db.select().from(feeds).where(
		eq(feeds.url, url)
	)
	return firstOrUndefined(result)
}

export async function markFeedFetched(feed_id: string) {
	await db.update(feeds).set(
		{ lastFetchedAt: sql`NOW()` },
	).where(
		eq(feeds.id, feed_id)
	)
}

export async function getNextFeedToFetch() {
	const result = await db.execute(sql`SELECT * FROM feeds ORDER BY feeds.last_fetched_at ASC NULLS FIRST LIMIT 1`)
	return firstOrUndefined(result)
}
