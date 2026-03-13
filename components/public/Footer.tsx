import { Droplets, Mail, Phone, MapPin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-gray-900">Clean & Fast</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Especialistas en limpieza industrial y mantenimiento menor para colegios,
              locales comerciales y hogares en Chile. Fundada en 2021.
            </p>
            <a
              href="https://www.instagram.com/cleanandfast._/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @cleanandfast._
            </a>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Servicios</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Limpieza de vidrios y fachadas</li>
              <li>Limpieza de logos corporativos</li>
              <li>Sanitización de tapiz y alfombras</li>
              <li>Mantenimiento menor</li>
              <li>Pintura e instalaciones</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+56977452010" className="hover:text-blue-600 transition-colors">
                    +56 9 7745 2010
                  </a>
                  <p className="text-xs text-gray-400">Jorge Jerez S. — Jefe de Operaciones</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="mailto:Cleanerandfaster@gmail.com" className="hover:text-blue-600 transition-colors">
                  Cleanerandfaster@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Santiago, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Clean and Fast. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
