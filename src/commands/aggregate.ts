import { fetchFeed } from "src/rss/rss.js"; // Ajusta la ruta a tu archivo

export async function commandAgg(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  // if (args.length === 0) {
  //   throw new Error(`The ${cmdName} command expects a feed Url`);
  // }
  // const feedUrl = args[0];
  const feedUrl = "https://www.wagslane.dev/index.xml";
  console.log(`📡 Fetching feed from: ${feedUrl}...`);

  try {
    const feed = await fetchFeed(feedUrl);

    console.log("\n✅ FEED PARSED SUCCESSFULLY:");
    console.log("----------------------------");
    console.log(`Title:       ${feed.channel.title}`);
    console.log(`Link:        ${feed.channel.link}`);
    console.log(`Description: ${feed.channel.description}`);
    console.log(`Items found: ${feed.channel.item.length}`);
    console.log("----------------------------\n");

    console.dir(feed, { depth: null, colors: true });
  } catch (error) {
    console.error("❌ Ocurrió un error:");
    console.error(error);
  }
}
