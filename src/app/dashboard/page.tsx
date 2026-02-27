import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function DashboardHome() {
  const kpis = [
    {
      label: "Ventas hoy",
      value: "$0",
      icon: DollarSign,
      trend: "+12%",
      positive: true,
    },
    {
      label: "Órdenes",
      value: "0",
      icon: ShoppingCart,
      trend: "-3%",
      positive: false,
    },
    {
      label: "Productos activos",
      value: "0",
      icon: Package,
      trend: "+5%",
      positive: true,
    },
    {
      label: "Clientes",
      value: "0",
      icon: Users,
      trend: "+18%",
      positive: true,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del negocio.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className="
                bg-card
                border border-border
                rounded-2xl
                p-6
                card-elevated
                transition-smooth
                hover:-translate-y-0.5
              "
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {kpi.label}
                </span>

                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-6 text-3xl font-semibold tracking-tight">
                {kpi.value}
              </div>

              {/* Trend */}
              <div
                className={`mt-3 text-sm font-medium ${
                  kpi.positive
                    ? "text-[oklch(0.58_0.16_150)]"
                    : "text-destructive"
                }`}
              >
                {kpi.trend} vs ayer
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
