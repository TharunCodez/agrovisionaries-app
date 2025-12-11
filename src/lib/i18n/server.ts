import { i18nOptions } from "./config";
import fs from "fs";
import path from "path";

export async function loadServerTranslations(locale: string, ns = "common") {
  const filePath = path.join(process.cwd(), "public/locales", locale, `${ns}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return { [ns]: data };
}
