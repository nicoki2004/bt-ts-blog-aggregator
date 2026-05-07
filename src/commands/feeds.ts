import { readConfig } from "src/config/config";
import { createFeed, getFeedByUrl, getFeeds } from "../lib/db/queries/feeds";
import { getUser, getUserById } from "../lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { createFeedFollows } from "src/lib/db/queries/feed_follows";
import { error } from "node:console";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
	if (args.length !== 2) {
		throw new Error(`usage: ${cmdName} <feed_name> <url>`);
	}

	const config = readConfig();
	const user = await getUser(config.currentUserName);

	if (!user) {
		throw new Error(`User ${config.currentUserName} not found`);
	}

	const feedName = args[0];
	const url = args[1];

	const feed = await createFeed(feedName, url, user.id);
	if (!feed) {
		throw new Error(`Failed to create feed`);
	}

	//Add Following for the current user
	let feed_follow
	try {
		feed_follow = await createFeedFollows(user.id, feed.id)
	} catch (e) {
		throw new Error(`Errror creating a feed follow`)
	}

	console.log("Feed created successfully:");
	printFeed(feed, user);
}

export async function handlerListFeeds(_: string) {
	const feeds = await getFeeds();

	if (feeds.length === 0) {
		console.log(`No feeds found.`);
		return;
	}

	console.log(`Found %d feeds:\n`, feeds.length);
	for (let feed of feeds) {
		const user = await getUserById(feed.userId);
		if (!user) {
			throw new Error(`Failed to find user for feed ${feed.id}`);
		}

		printFeed(feed, user);
		console.log(`=====================================`);
	}
}


export async function handlerFollow(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <url>`);
	}

	const url = args[0]

	//Get a Feed from a URL.
	const feed = await getFeedByUrl(url)
	if (!feed) {
		throw new Error(`Feed from ${url} not found`)
	}

	//Get the user
	const config = readConfig();
	const user = await getUser(config.currentUserName);

	if (!user) {
		throw new Error(`User ${config.currentUserName} not found`);
	}

	//Add a feed_follows.
	let feed_follow
	try {
		feed_follow = await createFeedFollows(user.id, feed.id)
	} catch (e) {
		throw new Error(`Errror creating a feed follow`)
	}

	//Print the feed follow
	if (feed_follow) {
		printFeed(feed_follow?.feed, feed_follow?.user)
	}
}


export function printFeed(feed: Feed, user: User) {
	console.log(`* ID:            ${feed.id}`);
	console.log(`* Created:       ${feed.createdAt}`);
	console.log(`* Updated:       ${feed.updatedAt}`);
	console.log(`* name:          ${feed.name}`);
	console.log(`* URL:           ${feed.url}`);
	console.log(`* User:          ${user.name}\n`);
}
