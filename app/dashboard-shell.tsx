"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCent,
  ClipboardList,
  FilePlus2,
  Gem,
  GitFork,
  LineChart,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  Share2,
  UserRound,
  Users,
  LogOut,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { AuthTokenPayload } from "@/lib/auth";
import { fromSlug, toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const menuItems = [
  { label: "Orders", icon: ClipboardList },
  { label: "New Order", icon: FilePlus2 },
  { label: "Article Sales", icon: BadgeCent },
  { label: "Forks", icon: GitFork },
  { label: "Customers", icon: Users },
  { label: "Suppliers", icon: UserRound },
  { label: "Articles", icon: Package },
  { label: "Mails", icon: Mail },
  { label: "Warranty", icon: ShieldCheck },
  {
    label: "Statistics",
    icon: LineChart,
    submenus: ["Sales", "Open Items", "Article"],
  },
  {
    label: "Values",
    icon: Gem,
    submenus: ["List", "Text"],
  },
  {
    label: "Settings",
    icon: Settings,
    submenus: ["Forms", "General", "User"],
  },
  { label: "Reference Fork", icon: Share2 },
];

function canSeeMenu(item: (typeof menuItems)[number], userRights: string) {
  const rights = userRights.toLowerCase();
  if (rights === "root" || rights === "administrator" || rights === "admin") {
    return true;
  }
  return item.label !== "Settings";
}

const getHref = (label: string) => `/${encodeURIComponent(toSlug(label))}`;
const getSubHref = (label: string, submenu: string) =>
  `/${encodeURIComponent(toSlug(label))}/${encodeURIComponent(
    toSlug(submenu),
  )}`;

export default function DashboardShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AuthTokenPayload | null;
}) {
  const pathname = usePathname();
  const visibleMenuItems = menuItems.filter((item) =>
    canSeeMenu(item, session?.userRights ?? ""),
  );
  const decodedPath = pathname ? decodeURIComponent(pathname) : "";
  const segments = decodedPath
    .split("/")
    .filter(Boolean)
    .map((segment) => fromSlug(segment));
  const activeLabel = segments[0] || "Orders";
  const activeSubmenu = segments[1];
  const hasActiveLabel = visibleMenuItems.some(
    (item) => item.label === activeLabel,
  );
  const headerTitle = hasActiveLabel ? activeLabel : "Orders";
  const headerSubtitle = activeSubmenu
    ? `${headerTitle} \u00b7 ${activeSubmenu}`
    : headerTitle;

  return (
    <div className="min-h-screen bg-primary text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-72 shrink-0 flex-col bg-blue-900 text-primary-foreground px-6 py-10">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-slate-700 shadow-sm">
              <GitFork className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Workspace
              </p>
              <p className="text-lg font-semibold text-slate-800">
                Fork Repair
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <Accordion
              defaultValue={[activeLabel]}
              key={activeLabel}
              className="space-y-2"
            >
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeLabel === item.label;

                if (!item.submenus) {
                  return (
                    <Link
                      key={item.label}
                      href={getHref(item.label)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full justify-between gap-2 px-3 py-5 text-[15px] font-medium text-slate-700 hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eaf2ff]",
                        isActive &&
                          "bg-primary-foreground/20 text-primary-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3 text-primary-foreground">
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  );
                }

                return (
                  <AccordionItem key={item.label} value={item.label}>
                    <AccordionTrigger
                      className={cn(
                        "text-primary-foreground font-mediumfocus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#eaf2ff] hover:bg-primary-foreground/10 px-3 py-2 text-[15px] transition-colors",
                        isActive && "bg-primary-foreground/10",
                      )}
                    >
                      <span className="flex items-center gap-3 text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                        <span className="hover:bg-primary-foreground/10 text-primary-foreground">
                          {item.label}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-11 space-y-2">
                        {item.submenus.map((submenu) => {
                          const isActiveSubmenu =
                            activeLabel === item.label &&
                            activeSubmenu === submenu;
                          return (
                            <Link
                              key={submenu}
                              href={getSubHref(item.label, submenu)}
                              className={cn(
                                "flex w-full text-primary-foreground items-center rounded-md px-3 py-2 font-medium text-sm transition hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eaf2ff]",
                                isActiveSubmenu && "bg-primary-foreground/10 ",
                              )}
                              aria-current={
                                isActiveSubmenu ? "page" : undefined
                              }
                            >
                              {submenu}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </nav>
          {session ? (
            <div className="p-4 border-t border-primary-foreground/20">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="size-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Users className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{session.username}</p>
                  <p className="text-xs opacity-70">{session.userGroup}</p>
                  <p className="text-xs opacity-70">{session.userRights}</p>
                  <p className="text-xs opacity-70">Version 2.0</p>
                </div>
              </div>
            </div>
          ) : null}
        </aside>

        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <header className="flex flex-wrap items-center justify-between gap-4 px-8 py-7">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">
                  {headerSubtitle}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <form action="/api/auth/logout" method="post">
                <Button
                  variant="destructive"
                  type="submit"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </form>
            </div>
          </header>

          <Separator className="mx-8" />

          <main className="flex-1 px-8 py-8">{children}</main>
          <Toaster position="top-center" />
        </div>
      </div>
    </div>
  );
}
