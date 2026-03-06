import { CommandsRegistry, runCommand } from "./command/command_handler";
import { getCommands } from "./command/register_commands";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }
  const commandsRegistry: CommandsRegistry = {};

  getCommands(commandsRegistry);

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
