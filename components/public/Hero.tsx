export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
        <span className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 ring-1 ring-white/20">
          Servicio profesional en Chile
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Limpieza industrial y mantenimiento
          <span className="block text-blue-200">con excelencia y compromiso</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
          Especialistas en limpieza de vidrios, fachadas y mantenimiento menor para colegios,
          locales comerciales y hogares en Chile. Trabajo de calidad en altura y a nivel,
          con todas las normas de seguridad vigentes.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contacto"
            className="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors sm:w-auto"
          >
            Solicitar presupuesto gratis
          </a>
          <a
            href="#servicios"
            className="w-full rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors sm:w-auto"
          >
            Ver servicios
          </a>
        </div>
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { label: "Desde el año", value: "2021" },
            { label: "Tipos de clientes", value: "3+" },
            { label: "Años de experiencia", value: "4+" },
            { label: "Servicios disponibles", value: "14+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-blue-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
