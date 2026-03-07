"use client";

import { ReactNode, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMe } from "@/hooks/useMe";
import { useLogout } from "@/hooks/useLogout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const { data: user, isLoading, isError } = useMe();
  console.log(user);
  const { mutate: logout, isPending: loggingOut } = useLogout();

  // Si /me falla (token expirado), redirige
  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  // Protección adicional por rol
  useEffect(() => {
    if (!user) return;

    if (
      pathname.startsWith("/dashboard/admins") &&
      user.role !== "SUPER_ADMIN"
    ) {
      router.replace("/dashboard");
    }
  }, [pathname, user, router]);

  const items = useMemo(() => {
    if (!user) return [];

    const base = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Órdenes", href: "/dashboard/orders", icon: ShoppingCart },
      {
        name: "Conversaciones",
        href: "/dashboard/conversations",
        icon: MessageSquare,
      },
      { name: "Clientes", href: "/dashboard/users", icon: Users },
      { name: "Productos", href: "/dashboard/products", icon: Package },

      { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    ];

    if (user.role === "SUPER_ADMIN") {
      base.push({
        name: "Administradores",
        href: "/dashboard/admins",
        icon: Users,
      });
    }

    return base;
  }, [user]);

  const sidebarW = collapsed ? "w-20" : "w-72";
  const contentPL = collapsed ? "pl-20" : "pl-72";
  const pageLabel = pathname.split("/").slice(2).join(" / ") || "dashboard";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Verificando sesión...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SIDEBAR */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50",
          "bg-card border-r border-border",
          "transition-all duration-300",
          sidebarW,
        ].join(" ")}
      >
        {/* HEADER SIDEBAR */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground grid place-items-center text-sm font-semibold">
              F
            </div>

            {!collapsed && (
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">Fluxen Admin</div>
                <div className="text-xs text-muted-foreground">
                  Control Panel
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="h-9 w-9 rounded-lg hover:bg-muted transition grid place-items-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* NAV */}
        <nav className="px-3 py-6 space-y-1">
          {items.map((it) => {
            const active = pathname === it.href;
            const Icon = it.icon;

            const link = (
              <Link
                href={it.href}
                key={it.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center" : "",
                ].join(" ")}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {!collapsed && <span className="font-medium">{it.name}</span>}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={it.href} text={it.name}>
                {link}
              </Tooltip>
            ) : (
              link
            );
          })}
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-3">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              Conectado como <span className="font-medium">{user.role}</span>
            </div>
          )}

          <button
            onClick={() => logout()}
            disabled={loggingOut}
            className={[
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              "text-red-500 hover:bg-red-500/10",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && (
              <span className="font-medium">
                {loggingOut ? "Cerrando..." : "Cerrar sesión"}
              </span>
            )}
          </button>

          {!collapsed ? (
            <div className="text-xs text-muted-foreground">
              v0.1 • Fluxen Admin
            </div>
          ) : (
            <div className="text-[10px] text-muted-foreground text-center">
              v0.1
            </div>
          )}
        </div>
      </aside>

      {/* CONTENT */}
      <div className={[contentPL, "transition-all duration-300"].join(" ")}>
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Fluxen</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-semibold capitalize tracking-tight">
              {pageLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
