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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <p className="text-zinc-600">Resumen general del negocio.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className="
          relative
          bg-card
          border border-border
          rounded-2xl
          p-6
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-1
          transition-all
          overflow-hidden
        "
            >
              {/* Glow background */}
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl" />

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{kpi.label}</div>

                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-6 text-4xl font-bold text-foreground">
                {kpi.value}
              </div>

              {/* Trend */}
              <div
                className={`mt-3 text-sm font-medium ${
                  kpi.positive ? "text-green-500" : "text-red-500"
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
