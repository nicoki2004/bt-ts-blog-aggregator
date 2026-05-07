import { and, asc, desc, eq, ilike, SQL } from "drizzle-orm";
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



export async function getFilteredPosts(userId: string, options: {
	limit?: number,
	offset?: number,
	search?: string,       // Para filtrar por título/descripción
	feedId?: string,       // Para filtrar por un feed específico
	sortBy?: 'date' | 'title',
	order?: 'asc' | 'desc'
}) {
	const {
		limit = 20,
		offset = 0,
		search,
		feedId,
		sortBy = 'date',
		order = 'desc'
	} = options;

	// 1. Construir filtros dinámicos
	const filters: SQL[] = [eq(feeds.userId, userId)];


	if (feedId) {
		filters.push(eq(posts.feedId, feedId));
	}

	if (search) {
		// ilike es para búsqueda "Case Insensitive" (ignora mayúsculas)
		filters.push(ilike(posts.title, `%${search}%`));
	}

	// 2. Determinar el orden
	const column = sortBy === 'title' ? posts.title : posts.publishedAt;
	const orderBy = order === 'desc' ? desc(column) : asc(column);



	console.log(`SQL Debug: Ordering by ${sortBy} ${order}`);
	// 3. Ejecutar la query
	return await db
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
		.where(and(...filters))
		.orderBy(orderBy)
		.limit(limit)
		.offset(offset);
}
