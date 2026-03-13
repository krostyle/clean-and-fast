import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    company: "Inmobiliaria Central",
    text: "Excelente servicio. Llegaron puntual y dejaron los vidrios del edificio impecables. Muy recomendados.",
    rating: 5,
  },
  {
    name: "Carlos Pérez",
    company: "Oficinas Torre Norte",
    text: "Tenemos contrato mensual con ellos hace 2 años. Siempre profesionales y el precio es muy competitivo.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    company: "Restaurante Vista",
    text: "Limpiaron los ventanales de nuestro restaurante en tiempo récord. Los clientes notaron la diferencia inmediatamente.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-blue-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm ring-1 ring-white/20"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 text-blue-100 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-blue-300">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
