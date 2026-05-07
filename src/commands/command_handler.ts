export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type CommandDefinition = {
	cmdName: string;
	description: string;
	usage: string;
	minArgs: number;
	cmd: CommandHandler;
};

export type CommandsRegistry = Record<string, CommandDefinition>;

export function registerCommand(
	registry: CommandsRegistry,
	cmdName: string,
	description: string,
	usage: string,
	minArgs: number,
	handler: CommandHandler,
) {
	registry[cmdName] = {
		cmdName: cmdName,
		description: description,
		usage: usage,
		minArgs: minArgs,
		cmd: handler,
	};
}

export async function runCommand(
	registry: CommandsRegistry,
	cmdName: string,
	...args: string[]
): Promise<void> {
	const handler = registry[cmdName];
	if (!handler) {
		throw new Error(`Unknown command: ${cmdName}`);
	}

	await handler.cmd(cmdName, ...args);
}
