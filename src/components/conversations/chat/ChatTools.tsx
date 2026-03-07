/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Zap,
  Tag,
  Bell,
  ShoppingCart,
  MapPin,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

type Props = {
  conversationId: string | null;
};

export default function ChatTools({ conversationId }: Props) {
  const [openMenu, setOpenMenu] = useState<"templates" | "direct" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!conversationId) return null;

  const toggleMenu = (menu: "templates" | "direct") => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  // cerrar al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      {/* PLANTILLAS */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("templates")}
          className="p-2 rounded-md hover:bg-muted transition text-indigo-500"
        >
          <FileText size={18} />
        </button>

        {openMenu === "templates" && (
          <div className="absolute bottom-full mb-2 left-0 w-60 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-xs text-muted-foreground border-b">
              Plantillas
            </div>

            <div className="flex flex-col text-sm">
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <Tag size={16} className="text-green-500" />
                Promoción
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <Bell size={16} className="text-yellow-500" />
                Recordatorio pedido
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <ShoppingCart size={16} className="text-blue-500" />
                Seguimiento compra
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <ClipboardCheck size={16} className="text-purple-500" />
                Recuperar carrito
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MENSAJES DIRECTOS */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("direct")}
          className="p-2 rounded-md hover:bg-muted transition text-red-500"
        >
          <Zap size={18} />
        </button>

        {openMenu === "direct" && (
          <div className="absolute bottom-full mb-2 left-0 w-60 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-xs text-muted-foreground border-b">
              Mensajes directos
            </div>

            <div className="flex flex-col text-sm">
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <MessageCircle size={16} className="text-green-500" />
                Enviar catálogo
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <MapPin size={16} className="text-red-500" />
                Compartir ubicación
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <ClipboardCheck size={16} className="text-indigo-500" />
                Enviar encuesta
              </button>

              <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted text-left">
                <ShoppingCart size={16} className="text-orange-500" />
                Confirmar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
