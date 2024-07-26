import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "../services/auth.service";
import { EAdminNavigation } from "../constants/navigation.constant";
import { commitSession, getSession } from "../utils/session.util";

export async function adminAuthLoader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: EAdminNavigation.dashboard,
  });

  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  return json<{ error?: { message: String } }>(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
