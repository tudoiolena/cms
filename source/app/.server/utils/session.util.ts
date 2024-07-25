import { createCookieSessionStorage } from "@remix-run/node";
import { environment } from "~/.server/constants/environment.constants";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [environment.cookie.secret],
    secure: environment.environment.isProduction,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
