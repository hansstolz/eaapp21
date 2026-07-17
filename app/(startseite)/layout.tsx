import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import DashboardShell from "../dashboard-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthSession } from "@/lib/auth-session";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EA App",
  description: "Geschuetzte EA App",
};

export default async function StartseiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  return (
    <html
      lang="de"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full">
        <TooltipProvider>
          <DashboardShell session={session}>{children}</DashboardShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
