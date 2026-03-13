import { ShieldCheck, Users, Target, Lightbulb } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Seguridad certificada",
    description:
      "Todos nuestros trabajos se ejecutan cumpliendo estrictamente las normas y medidas de seguridad vigentes, tanto en altura como a nivel.",
  },
  {
    icon: Users,
    title: "Amplia cobertura",
    description:
      "Atendemos colegios, locales comerciales y hogares con el mismo nivel de dedicación y profesionalismo, adaptándonos a las necesidades de cada cliente.",
  },
  {
    icon: Target,
    title: "Fidelidad y compromiso",
    description:
      "Nuestro objetivo principal es construir relaciones de confianza duraderas, brindando siempre un servicio impecable y a la altura de las expectativas.",
  },
  {
    icon: Lightbulb,
    title: "Innovación constante",
    description:
      "Nos mantenemos en permanente búsqueda de los mejores productos e implementos del mercado para ofrecer resultados de excelencia en cada servicio.",
  },
];

export function WhyUs() {
  return (
    <section id="nosotros" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Historia */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Nuestra historia
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Una idea que tardó 15 años en nacer
            </h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Clean &amp; Fast nace en enero de 2021, materializando una idea que llevaba
                más de 15 años en mente. Creada con la firme convicción de ayudar a sus
                clientes a tener una mejor presentación visual y panorámica, ofreciendo
                trabajo de excelencia y calidad tanto en altura como a nivel, además de
                mantenimiento en obras menores.
              </p>
              <p>
                Hoy atendemos colegios, locales comerciales y hogares particulares, cubriendo
                de manera integral las necesidades de cada cliente con todas las medidas y
                normas de seguridad correspondientes.
              </p>
              <p>
                Nuestro enfoque es conseguir fidelidad con nuestros clientes y mantener
                nuestros servicios siempre con el más alto nivel de profesionalismo y
                dedicación.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2021", label: "Año de fundación" },
              { value: "15+", label: "Años de experiencia previa" },
              { value: "3", label: "Tipos de clientes atendidos" },
              { value: "100%", label: "Compromiso en cada servicio" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-4xl font-bold text-blue-600">{s.value}</p>
                <p className="mt-2 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ¿Por qué elegirnos? */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Nos diferenciamos por nuestra confiabilidad, compromiso y visión de largo plazo
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
