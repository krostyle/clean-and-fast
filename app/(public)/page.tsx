import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Services } from "@/components/public/Services";
import { WhyUs } from "@/components/public/WhyUs";
import { Gallery } from "@/components/public/Gallery";
import { Testimonials } from "@/components/public/Testimonials";
import { ContactForm } from "@/components/public/ContactForm";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Clean and Fast — Limpieza profesional de vidrios en Chile",
  description:
    "Especialistas en limpieza de cristales, fachadas y mantenimiento para empresas y hogares en Chile. Presupuesto gratis.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
}
