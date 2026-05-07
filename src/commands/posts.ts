
import parseArgs from 'minimist';

import { getFilteredPosts, getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

type PostSummary = {
	id: string;
	title: string;
	url: string;
	description: string | null;
	publishedAt: Date;
	feedName: string;
};



export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {

	const argv = parseArgs(args, {
		string: ['search', 'sort', 'order'],
		alias: {
			s: 'search',
			o: 'sort',
			r: 'order'
		},
		default: {
			sort: 'date',
			order: 'desc',
			limit: 20
		}
	});


	const search = argv.search;
	const sortBy = argv.sort;
	const limit = parseInt(argv.limit);
	const order = argv.order

	const posts = await getFilteredPosts(user.id, {
		search,
		sortBy: sortBy === 'title' ? 'title' : 'date',
		limit: limit,
		order: order,

	});
	//
	// let limit = 2
	// if (args.length === 1) {
	// 	limit = Number(args[0])
	// }

	// const posts = await getPostsForUser(user.id, limit)
	posts.forEach(printPost);

}


export function printPost(post: PostSummary) {
	const date = post.publishedAt.toLocaleDateString();

	console.log(`\x1b[36m--- ${post.title} ---\x1b[0m`); // Cian para el título
	console.log(`Feed:    ${post.feedName}`);
	console.log(`Date:    ${date}`);
	console.log(`Link:    ${post.url}`);

	if (post.description) {
		// Limpiamos un poco la descripción por si tiene mucho texto
		const cleanDesc = post.description.length > 100
			? post.description.substring(0, 100) + "..."
			: post.description;
		console.log(`Summary: ${cleanDesc}`);
	}

	console.log("\n"); // Espacio extra entre posts
}
