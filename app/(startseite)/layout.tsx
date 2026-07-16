import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import DashboardShell from "../dashboard-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EA App",
  description: "Geschuetzte EA App",
};

export default function StartseiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
