import { google } from "googleapis";
import path from "path";
import { ENV } from "../config/env";

const serviceAccountPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../service-account.json")
    : "/etc/secrets/service-account.json";

const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = ENV.GOOGLE_SPREADSHEET_ID;

export { sheets, SPREADSHEET_ID };
