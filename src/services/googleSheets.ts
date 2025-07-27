import dotenv from "dotenv";
import { google } from "googleapis";
import path from "path";

dotenv.config({ path: ".env.local" });

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../service-account.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

export { sheets, SPREADSHEET_ID };
