import { getCookie } from "cookies-next";

export function getCookieClient(): string {
  return getCookie("session")?.toString() ?? "";
}
