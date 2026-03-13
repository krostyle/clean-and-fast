"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mensaje muy corto"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSent(true);
    reset();
  };

  return (
    <section id="contacto" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contáctenos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Estaríamos muy contentos de poder ser sus proveedores de servicios.
            Contáctenos y le responderemos a la brevedad.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Datos de contacto */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <a href="tel:+56977452010" className="text-sm text-blue-600 hover:underline">
                      +56 9 7745 2010
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Correo electrónico</p>
                    <a href="mailto:Cleanerandfaster@gmail.com" className="text-sm text-blue-600 hover:underline">
                      Cleanerandfaster@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <blockquote className="text-sm text-gray-600 italic leading-relaxed">
                  "En Clean &amp; Fast nos comprometemos a realizar nuestro servicio con el más
                  alto nivel de seguridad, compromiso y calidad, teniendo como objetivo principal
                  satisfacer las necesidades de cada uno de nuestros clientes."
                </blockquote>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900">Jorge Jerez S.</p>
                  <p className="text-xs text-gray-500">Jefe de Operaciones — Clean &amp; Fast</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div>
            {sent ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center h-full flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-green-800">
                  ¡Mensaje enviado con éxito!
                </p>
                <p className="mt-2 text-green-700">
                  Nos pondremos en contacto con usted a la brevedad.
                </p>
                <Button className="mt-6" onClick={() => setSent(false)}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" {...register("name")} placeholder="Su nombre" />
                    {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="su@email.com" />
                    {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" {...register("phone")} placeholder="+56 9 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Cuéntenos sobre su proyecto o necesidad..."
                    rows={5}
                  />
                  {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar solicitud de presupuesto"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
