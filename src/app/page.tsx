import Link from "next/link";
import { ArrowRight, BarChart3, Users, Package } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="text-lg font-semibold">Trendia Admin</div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition"
          >
            Dashboard
          </Link>

          <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition">
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
          Gestiona tu ecommerce
          <br />
          de forma inteligente
        </h1>

        <p className="mt-6 text-zinc-600 max-w-2xl mx-auto text-lg">
          Administra productos, clientes y órdenes desde un solo lugar. Diseñado
          para negocios que venden por WhatsApp y redes sociales.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition shadow-sm"
          >
            Ir al Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition">
            Ver Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:grid-cols-3">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 mx-auto">
              <Package className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg">Gestión de Productos</h3>
            <p className="text-sm text-zinc-600">
              Controla precios, costos, stock y márgenes en tiempo real.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 mx-auto">
              <Users className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg">Gestión de Clientes</h3>
            <p className="text-sm text-zinc-600">
              Centraliza tus leads de WhatsApp y convierte más ventas.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 mx-auto">
              <BarChart3 className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="font-semibold text-lg">Analítica Inteligente</h3>
            <p className="text-sm text-zinc-600">
              Toma decisiones basadas en datos reales de tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Trendia Admin. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
