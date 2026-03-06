import { CommandsRegistry, registerCommand } from "./command_handler";
import {
  commandLogin,
  commandRegister,
  commandReset,
  commandUsers,
} from "./users";

export function getCommands(commandsRegistry: CommandsRegistry) {
  registerCommand(
    commandsRegistry,
    "login",
    "Login a user an set the username in the config file",
    "login <username>",
    1,
    commandLogin,
  );

  registerCommand(
    commandsRegistry,
    "register",
    "Register a user",
    "register <username>",
    1,
    commandRegister,
  );

  registerCommand(
    commandsRegistry,
    "reset",
    "Reset all users",
    "reset",
    0,
    commandReset,
  );

  registerCommand(
    commandsRegistry,
    "users",
    "List all users",
    "users",
    0,
    commandUsers,
  );
}
