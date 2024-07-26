import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import { comparePassword } from "~/.server/shared/utils/auth.util";
import { sessionStorage } from "~/.server/admin/utils/session.util";
import { prisma } from "~/.server/shared/utils/prisma.util";
import type { User } from "@prisma/client";

export const ADMIN_AUTH_STRATEGY = "admin-pass";

export const authenticator = new Authenticator<User>(sessionStorage);

const findUser = async (email: string, password: string): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: email } });

  invariant(await comparePassword(password, user.password), "Wrong password");

  return user;
};
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    invariant(typeof email === "string", "username must be a string");
    invariant(email.length > 0, "username must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    return await findUser(email, password);
  }),
  ADMIN_AUTH_STRATEGY
);
