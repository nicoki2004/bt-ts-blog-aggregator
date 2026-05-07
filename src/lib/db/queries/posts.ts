import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, posts } from "../schema";



export async function createPost(
	title: string,
	url: string,
	description: string,
	published_at: string,
	feed_id: string
) {
	const [results] = await db.insert(posts).values({
		title: title,
		url: url,
		description: description,
		publishedAt: new Date(published_at),
		feedId: feed_id
	}).returning();

	return results
}

export async function getPostsForUser(
	userId: string,
	limit: number = 2
) {
	const results = await db
		.select({
			id: posts.id,
			title: posts.title,
			url: posts.url,
			description: posts.description,
			publishedAt: posts.publishedAt,
			feedName: feeds.name,
		})
		.from(posts)
		.innerJoin(feeds, eq(posts.feedId, feeds.id))
		.where(
			eq(feeds.userId, userId)
		)
		.orderBy(desc(posts.publishedAt))
		.limit(limit);

	return results;
}
