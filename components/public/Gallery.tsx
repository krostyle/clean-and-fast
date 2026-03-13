import { BeforeAfterCard } from "./GalleryImage";

const galleryItems = [
  {
    label: "Eliminación de pintura por Spray y Óleo",
    leftSrc:   "/gallery/pintura-spray-antes.jpg",
    rightSrc:  "/gallery/pintura-spray-despues.jpg",
    leftLabel: "Antes", leftColor: "bg-slate-500",
    rightLabel: "Después", rightColor: "bg-blue-600",
  },
  {
    label: "Limpieza de vidrios y Fachada",
    leftSrc:   "/gallery/vidrios-fachada-antes.jpg",
    rightSrc:  "/gallery/vidrios-fachada-despues.jpg",
    leftLabel: "Antes", leftColor: "bg-slate-500",
    rightLabel: "Después", rightColor: "bg-blue-600",
  },
  {
    label: "Limpieza de vidrios y Logos corporativos",
    leftSrc:   "/gallery/logos-corporativos-antes.jpg",
    rightSrc:  "/gallery/logos-corporativos-despues.jpg",
    leftLabel: "Antes", leftColor: "bg-slate-500",
    rightLabel: "Después", rightColor: "bg-blue-600",
  },
  {
    label: "Obra menor — Canalización sistema de drenaje",
    leftSrc:   "/gallery/obra-menor-drenaje-antes.jpg",
    rightSrc:  "/gallery/obra-menor-drenaje-despues.jpg",
    leftLabel: "Antes", leftColor: "bg-slate-500",
    rightLabel: "Después", rightColor: "bg-blue-600",
  },
  {
    label: "Limpieza de tapiz, sillones y colchones",
    leftSrc:   "/gallery/tapiz-sillones-antes.jpg",
    rightSrc:  "/gallery/tapiz-sillones-despues.jpg",
    leftLabel: "Antes", leftColor: "bg-slate-500",
    rightLabel: "Después", rightColor: "bg-blue-600",
  },
  {
    label: "Sanitización de alfombras y colchones",
    leftSrc:   "/gallery/sanitizacion-alfombra.jpg",
    rightSrc:  "/gallery/sanitizacion-colchon.jpg",
    leftLabel: "Alfombra", leftColor: "bg-teal-600",
    rightLabel: "Colchón",  rightColor: "bg-teal-600",
  },
];

export function Gallery() {
  return (
    <section id="galeria" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Antes y después
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            El resultado habla por sí solo — así transformamos cada espacio
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <BeforeAfterCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
