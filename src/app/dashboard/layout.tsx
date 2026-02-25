"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(
    () => [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Productos", href: "/dashboard/products", icon: Package },
      { name: "Clientes", href: "/dashboard/users", icon: Users },
      { name: "Órdenes", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    ],
    [],
  );

  const sidebarW = collapsed ? "w-20" : "w-72";
  const contentPL = collapsed ? "pl-20" : "pl-72";

  const pageLabel = pathname.split("/").slice(2).join(" / ") || "dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* SIDEBAR */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50",
          "bg-card border-r border-border",
          "backdrop-blur-xl",
          "transition-all duration-300",
          sidebarW,
        ].join(" ")}
      >
        {/* Brand + Toggle */}
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-md grid place-items-center text-sm font-semibold shadow-sm">
              T
            </div>

            {!collapsed && (
              <div className="leading-tight">
                <div className="font-semibold text-zinc-900">Trendia Admin</div>
                <div className="text-xs text-zinc-500">Ecommerce</div>
              </div>
            )}
          </div>

          {/* BOTÓN COLAPSAR */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="h-9 w-9 rounded-lg hover:bg-zinc-100 transition grid place-items-center cursor-pointer"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-zinc-700" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-zinc-700" />
            )}
          </button>
        </div>

        {/* NAV */}
        <nav className="px-3 py-4 space-y-1">
          {items.map((it) => {
            const active = pathname === it.href;
            const Icon = it.icon;

            const link = (
              <Link
                href={it.href}
                key={it.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  collapsed ? "justify-center" : "",
                ].join(" ")}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
                {!collapsed && <span className="font-medium">{it.name}</span>}
              </Link>
            );

            // Tooltip solo cuando está colapsado
            return collapsed ? (
              <Tooltip key={it.href} text={it.name}>
                {link}
              </Tooltip>
            ) : (
              link
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {!collapsed ? (
            <div className="text-xs text-zinc-500">v0.1 • Ecommerce Admin</div>
          ) : (
            <div className="text-[10px] text-zinc-500 text-center">v0.1</div>
          )}
        </div>
      </aside>

      {/* CONTENT */}
      <div className={[contentPL, "transition-all duration-200"].join(" ")}>
        {/* HEADER */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-500">Ecommerce</span>
            <span className="text-zinc-300">/</span>
            <span className="font-medium text-zinc-900 capitalize">
              {pageLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full bg-zinc-200 hover:bg-zinc-300 transition cursor-pointer"
              title="Perfil"
            />
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
