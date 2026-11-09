// NEXT_PUBLIC_* is replaced by Next.js at build time for the server and browser.
export type DataMode = "mock" | "api";
const configured = process.env.NEXT_PUBLIC_DATA_MODE ?? "api";
if (configured !== "mock" && configured !== "api") {
  throw new Error("NEXT_PUBLIC_DATA_MODE must be mock or api.");
}
export const DATA_MODE: DataMode = configured;
export const IS_MOCK = DATA_MODE === "mock";
