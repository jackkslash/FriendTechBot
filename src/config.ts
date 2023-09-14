import dotenv from "dotenv";
dotenv.config();
const { CLIENTID, GUILDID, DISCORDBOTTOKEN, IMGAPI } = process.env;

if (!CLIENTID || !GUILDID || !DISCORDBOTTOKEN || !IMGAPI) {
  throw new Error("Missing .env vars");
}

const config: Record<string, string> = {
  CLIENTID,
  GUILDID,
  DISCORDBOTTOKEN,
  IMGAPI,
};

export default config;
