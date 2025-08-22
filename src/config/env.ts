import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ENV = {
  DISCORD_PUBLIC_KEY: getEnvVar("DISCORD_PUBLIC_KEY"),
  DISCORD_TOKEN: getEnvVar("DISCORD_TOKEN"),
  DISCORD_CLIENT_ID: getEnvVar("DISCORD_CLIENT_ID"),
  DISCORD_GUILD_ID: getEnvVar("DISCORD_GUILD_ID"),
  CHECKIN_CHANNEL_ID: getEnvVar("CHECKIN_CHANNEL_ID"),
  POSTING_CHANNEL_ID: getEnvVar("POSTING_CHANNEL_ID"),
  ASK_OR_SUGGEST_CHANNEL_ID: getEnvVar("ASK_OR_SUGGEST_CHANNEL_ID"),
  GOOGLE_SPREADSHEET_ID: getEnvVar("GOOGLE_SPREADSHEET_ID"),
  WAITING_NOTIFICATION_CHANNEL_ID: getEnvVar("WAITING_NOTIFICATION_CHANNEL_ID"),
  STUDY_REJOIN_CHANNEL_ID: getEnvVar("STUDY_REJOIN_CHANNEL_ID"),
  TOPPY_TALK_CHANNEL_ID: getEnvVar("TOPPY_TALK_CHANNEL_ID"),
};
