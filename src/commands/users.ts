import { getConfigUserName, setUser } from "src/config/config";
import {
  createUser,
  deleteAllUsers,
  getUser,
  getUsers,
} from "src/lib/db/queries/users";

export async function commandLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error(`The ${cmdName} command expects a username`);
  }
  const username = args[0];

  const user = await getUser(username);

  if (!user) {
    throw new Error(`User: ${username} is not registered`);
  }

  setUser(username);

  console.log(`User has been set to ${username}`);
}

export async function commandRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error(`The ${cmdName} command expects a username`);
  }
  const username = args[0];

  try {
    await createUser(username);
  } catch (e) {
    throw new Error(`Error registering a user - ${e}`);
  }

  setUser(username);

  console.log(`User has been register to ${username}`);
}

export async function commandReset(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  try {
    await deleteAllUsers();
  } catch (e) {
    throw new Error(`Error deleting users- ${e}`);
  }

  console.log(`Users has been deleted`);
}

export async function commandUsers(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  let users;
  try {
    users = await getUsers();
  } catch (e) {
    throw new Error(`Error registering a user - ${e}`);
  }
  const currentUser = getConfigUserName();
  users.forEach((user) => {
    console.log(
      ` * ${user.name}${currentUser === user.name ? " (current)" : ""}`,
    );
  });
}
