import { REST } from "discord.js";
import { Routes } from "discord.js";
import config from "./config";
import * as commandsModules from "./commands";

type Command = {
  data: unknown;
};

const commands = [];

for (const module of Object.values<Command>(commandsModules)) {
  commands.push(module.data);
}

const rest = new REST({ version: "10" }).setToken(config.DISCORDBOTTOKEN);

try {
  console.log("starting refresh of commands");
  rest.put(Routes.applicationGuildCommands(config.CLIENTID, config.GUILDID), {
    body: commands,
  });
  console.log("done loading commands");
} catch (error) {
  console.error(error);
}
