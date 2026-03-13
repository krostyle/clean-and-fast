import { Droplets, Wrench, Package, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Limpieza Industrial",
    description:
      "Soluciones profesionales de limpieza para colegios, locales comerciales y hogares, con productos que no generan olor ni comprometen el entorno de trabajo.",
    features: [
      "Limpieza de grasa, adhesivos y pintura en vidrios",
      "Limpieza de logos corporativos",
      "Limpieza de fachadas en altura y a nivel",
      "Limpieza y sanitización de tapiz y alfombras",
      "Limpieza de canaletas",
      "Lavado y sanitización de pisos y muros",
    ],
  },
  {
    icon: Wrench,
    title: "Mantenimiento Menor",
    description:
      "Servicios de mantención y reparación para conservar y mejorar las instalaciones de su propiedad, entregando soluciones integrales con profesionalismo.",
    features: [
      "Pintura interior y exterior",
      "Instalación de láminas de seguridad",
      "Empavonados",
      "Reparaciones y remodelaciones",
      "Soldadura",
      "Grifería y construcción menor",
    ],
  },
  {
    icon: Package,
    title: "Insumos y Productos",
    description:
      "Utilizamos exclusivamente productos especializados que garantizan resultados de excelencia sin afectar el entorno ni la continuidad de las actividades cercanas.",
    features: [
      "Productos sin olor ni residuos tóxicos",
      "Inocuidad garantizada en cada trabajo",
      "No interrumpen procesos productivos",
      "Certificados para uso en colegios y oficinas",
      "Equipamiento de protección personal certificado",
      "Cumplimiento de normas de seguridad vigentes",
    ],
  },
];

export function Services() {
  return (
    <section id="servicios" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Soluciones integrales de limpieza y mantenimiento para su empresa u hogar
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mb-6 text-gray-600 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
