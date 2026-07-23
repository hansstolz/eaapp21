import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error: string | undefined): string | null {
  if (error === "invalid") {
    return "Benutzername/E-Mail oder Passwort ist falsch.";
  }

  if (error === "config") {
    return "Der Login ist noch nicht korrekt konfiguriert.";
  }

  return null;
}

function getSafeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/orders";
  }

  return next;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  const existingSession = await verifyAuthToken(token);
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);

  if (existingSession) {
    redirect(nextPath);
  }

  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10 text-zinc-950">
      <section className="w-full max-w-sm rounded-lg border border-stone-200 bg-stone-100 p-6 shadow-sm">
        <div className="mb-6">
          <div>
            <img src="/_images/88_logo_blau_rot.png" alt="Logo" width={320} />

            <h1 className="mt-6 text-2xl font-semibold">Login</h1>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Melde dich mit Benutzername oder E-Mail-Adresse und Passwort an.
          </p>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <form action="/api/auth/login" method="post" className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">
              Benutzername oder E-Mail-Adresse
            </span>
            <input
              className="mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-zinc-900"
              name="identifier"
              type="text"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Passwort</span>
            <input
              className="mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-zinc-900"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <Button className="w-full h-12 text-lg" type="submit">
            Einloggen
          </Button>
        </form>
      </section>
    </main>
  );
}
