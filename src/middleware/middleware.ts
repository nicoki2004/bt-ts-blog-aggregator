import { CommandHandler } from "src/commands/command_handler";
import { readConfig } from "src/config/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

type UserCommandHandler = (
	cmdName: string,
	user: User,
	...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: middlewareLoggedIn = (handler) => {
	return async (cmdName: string, ...args: string[]) => {
		const config = readConfig();

		const user = await getUser(config.currentUserName);

		if (!user) {
			throw new Error(`Este comando requiere estar logueado. Usuario '${config.currentUserName}' no encontrado.`);
		}

		return await handler(cmdName, user, ...args);
	};
};
