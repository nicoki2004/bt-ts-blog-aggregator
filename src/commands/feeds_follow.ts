import { UUID } from "node:crypto";
import { createFeedFollows, getFeedFollowsFromUser } from "src/lib/db/queries/feed_follows";
import { printFeed } from "./feeds";
import { User } from "src/lib/db/schema";



export async function HandlerCreateFeedFollow(user_id: UUID, feed_id: UUID) {
	return await createFeedFollows(user_id, feed_id)

}

export async function getFeedFollowsForUser(user_id: string) {
	const feed_from_user = getFeedFollowsFromUser(user_id)
	return feed_from_user
}


export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
	if (args.length !== 0) {
		throw new Error(`usage: ${cmdName}`);
	}
	//Get the user
	// const config = readConfig();
	// const user = await getUser(config.currentUserName);
	//
	// if (!user) {
	// 	throw new Error(`User ${config.currentUserName} not found`);
	// }
	//
	const feeds_follow = await getFeedFollowsForUser(user.id)

	for (const feed_f of feeds_follow) {
		printFeed(feed_f.feed, feed_f.user)
	}

}
