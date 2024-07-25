import { PrismaClient } from "@prisma/client/extension";
import { environment } from "../../app/.server/constants/environment.constants";
import { $Enums } from "@prisma/client";
import { hashPassword } from "../../app/.server/utils/auth.util";

export const createDefaultAdmin = async (prisma: PrismaClient) => {
  console.log("Seeding default admin");
  const user = await prisma.user.findFirst({
    where: { email: environment.users.admin.email },
  });

  if (user) {
    console.log("Default admin already exists");
    return;
  }

  console.log("Creating default admin");
  await prisma.user.create({
    data: {
      fullName: "Default Admin",
      email: environment.users.admin.email,
      password: await hashPassword(environment.users.admin.password),
      role: $Enums.AdminRole.ADMIN,
    },
  });
};
