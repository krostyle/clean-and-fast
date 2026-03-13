import Link from "next/link";
import { Droplets, Instagram } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">Clean & Fast</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Servicios
          </a>
          <a href="#nosotros" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Nosotros
          </a>
          <a href="#galeria" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Galería
          </a>
          <a href="#testimonios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Testimonios
          </a>
          <a href="#contacto" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Contacto
          </a>
          <a
            href="https://www.instagram.com/cleanandfast._/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
        <a
          href="#contacto"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Solicitar presupuesto
        </a>
      </div>
    </nav>
  );
}
