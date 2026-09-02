"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoDignaLearn from "@/components/ui/LogoDignaLearn";

const PASOS = [
  {
    numero: "01",
    icono: "👩‍🏫",
    titulo: "Tu docente crea tu cuenta",
    descripcion: "Recibís un código único DL-XXXX y un PIN de 4 dígitos para entrar, sin necesidad de correo electrónico.",
    color: "#F0A8B6",
  },
  {
    numero: "02",
    icono: "🔑",
    titulo: "Ingresás con tu código",
    descripcion: "Usás tu código DL-XXXX y un PIN de 4 dígitos. Sin email, sin contraseña.",
    color: "#A4CDD5",
  },
  {
    numero: "03",
    icono: "📚",
    titulo: "Aprendés a tu ritmo",
    descripcion: "Lectura, minijuego y reflexión por cada tema. Vos decidís cuándo y cómo.",
    color: "#F0A8B6",
  },
  {
    numero: "04",
    icono: "⭐",
    titulo: "Ganás logros",
    descripcion: "Al completar temas y unidades desbloqueás logros. Tu docente ve tu avance.",
    color: "#A4CDD5",
  },
];

const VALORES = [
  { icono: "📘", titulo: "EDUCACIÓN", descripcion: "Transmitimos temas de interés para todas las edades." },
  { icono: "🤝", titulo: "CONEXIÓN", descripcion: "Entendimiento y comunicación entre docente y estudiante." },
  { icono: "✨", titulo: "SENCILLEZ", descripcion: "Uso y comprensión intuitiva, accesible desde cualquier dispositivo." },
  { icono: "💡", titulo: "INNOVACIÓN", descripcion: "Estrategias innovadoras que incorporan juego para mejorar el aprendizaje." },
  { icono: "🌱", titulo: "CRECIMIENTO", descripcion: "Guiamos a cada estudiante en su desarrollo académico y personal." },
];

const EQUIPO = [
  { emoji: "⚙️", nombre: "Dirk Martinez", rol: "Backend", color: "#A4CDD5" },
  { emoji: "👨‍💼", nombre: "Eddy Marenco", rol: "Líder y Marketing", color: "#F0A8B6" },
  { emoji: "📣", nombre: "Ronald Dávila", rol: "Comunicador", color: "#A4CDD5" },
  { emoji: "🎨", nombre: "Sharis Peralta", rol: "Diseño", color: "#F0A8B6" },
  { emoji: "💻", nombre: "Sidar Perez", rol: "Frontend", color: "#A4CDD5" },
];

function irASeccion(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#160B24", color: "#FFFFFF" }}>
      {/* ━━━ NAVBAR ━━━ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ backgroundColor: scrolled ? "rgba(22,11,36,0.75)" : "#160B24" }}
        transition={{ duration: 0.3 }}
        style={{
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <LogoDignaLearn size={36} showWordmark={true} darkBackground={true} />

          <div className="hidden md:flex gap-8">
            <button
              type="button"
              onClick={() => irASeccion("como-funciona")}
              className="text-white/70 hover:text-white transition-colors font-medium"
            >
              Cómo funciona
            </button>
            <button
              type="button"
              onClick={() => irASeccion("nosotros")}
              className="text-white/70 hover:text-white transition-colors font-medium"
            >
              Nosotros
            </button>
            <button
              type="button"
              onClick={() => irASeccion("valores")}
              className="text-white/70 hover:text-white transition-colors font-medium"
            >
              Valores
            </button>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="block bg-[#F0A8B6] hover:bg-[#F0A8B6]/80 text-[#160B24] font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Ingresar →
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ━━━ HERO ━━━ */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
        style={{ backgroundColor: "#160B24" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.span
            className="absolute select-none text-9xl"
            style={{ top: "12%", right: "8%", color: "#F0A8B6", opacity: 0.08 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            ♀
          </motion.span>
          <motion.span
            className="absolute select-none text-8xl"
            style={{ bottom: "10%", left: "8%", color: "#A4CDD5", opacity: 0.07 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            ★
          </motion.span>
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ top: "-5%", left: "-8%", border: "1px solid rgba(164,205,213,0.2)" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="inline-block rounded-full px-4 py-1.5 text-sm"
            style={{ backgroundColor: "rgba(240,168,182,0.15)", color: "#F0A8B6" }}
          >
            ✨ Plataforma educativa del MINED Nicaragua
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mt-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aprendé tus <span style={{ color: "#F0A8B6" }}>derechos</span> jugando
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 mt-6 max-w-xl mx-auto"
          >
            DignaLearn es la experiencia educativa gamificada para la asignatura{" "}
            <strong style={{ color: "#A4CDD5" }}>Derechos y Dignidad de la Mujer</strong>, disponible para primaria y secundaria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(240,168,182,0.4)" }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="block bg-[#F0A8B6] text-[#160B24] font-bold px-8 py-4 rounded-full text-lg"
              >
                Soy estudiante →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "rgba(164,205,213,0.1)" }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="block border-2 border-[#A4CDD5] text-[#A4CDD5] px-8 py-4 rounded-full text-lg font-semibold"
              >
                Soy docente →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl text-white/40 mt-16"
              aria-hidden
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ TARJETAS DOPAMÍNICAS ━━━ */}
      <section className="py-20 px-6" style={{ backgroundColor: "#160B24" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Todo lo que necesitás para aprender
        </motion.h2>
        <p className="text-white/60 text-center mb-14 max-w-xl mx-auto">
          Una experiencia diseñada para que aprender tus derechos se sienta cercano, divertido y tuyo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0 }}
            whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(240,168,182,0.25)" }}
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(240,168,182,0.15), rgba(240,168,182,0.05))",
              border: "1px solid rgba(240,168,182,0.2)",
            }}
          >
            <p className="text-5xl mb-4" aria-hidden>🎮</p>
            <h3 className="text-xl font-bold text-white">Aprende jugando</h3>
            <p className="text-white/65 text-sm mt-2">
              Sopas de letras, quizzes y escenarios reales del currículo MINED. Cada actividad refuerza lo que aprendiste.
            </p>
            <Link href="/login" className="block text-sm font-semibold mt-6" style={{ color: "#F0A8B6" }}>
              Empezar ahora →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(164,205,213,0.25)" }}
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(164,205,213,0.15), rgba(164,205,213,0.05))",
              border: "1px solid rgba(164,205,213,0.2)",
            }}
          >
            <p className="text-5xl mb-4" aria-hidden>📖</p>
            <h3 className="text-xl font-bold text-white">Modo Historia</h3>
            <p className="text-white/65 text-sm mt-2">
              Una novela visual educativa donde los personajes enfrentan situaciones reales sobre derechos, dignidad e igualdad.
            </p>
            <Link href="/login" className="block text-sm font-semibold mt-6" style={{ color: "#A4CDD5" }}>
              Explorar →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(240,168,182,0.2)" }}
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(240,168,182,0.1), rgba(164,205,213,0.1))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-5xl mb-4" aria-hidden>🏆</p>
            <h3 className="text-xl font-bold text-white">Logros y racha</h3>
            <p className="text-white/65 text-sm mt-2">
              Desbloqueá logros al dominar temas, mantené tu racha diaria y visualizá tu avance en el currículo completo.
            </p>
            <Link href="/login" className="block text-sm font-semibold mt-6" style={{ color: "#F0A8B6" }}>
              Ver logros →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ CÓMO FUNCIONA ━━━ */}
      <section id="como-funciona" className="py-20 px-6 bg-white/[0.02]" style={{ backgroundColor: "#160B24" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          ¿Cómo funciona?
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-14">
          {PASOS.map((paso, idx) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <p className="text-6xl font-bold" style={{ color: `${paso.color}33` }}>{paso.numero}</p>
              <p className="text-3xl -mt-4" aria-hidden>{paso.icono}</p>
              <h3 className="text-white font-semibold mt-2">{paso.titulo}</h3>
              <p className="text-white/60 text-sm mt-1">{paso.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━ VALORES DE LA MARCA ━━━ */}
      <section id="valores" className="py-20 px-6" style={{ backgroundColor: "#160B24" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Los valores de DignaLearn
        </motion.h2>
        <p className="text-white/60 text-center mb-14 max-w-xl mx-auto">
          Lo que nos guía en cada decisión de diseño y contenido.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {VALORES.map((valor, idx) => (
            <motion.div
              key={valor.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ borderColor: "rgba(240,168,182,0.4)", y: -4 }}
              className="rounded-xl p-6"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-3xl mb-3" aria-hidden>{valor.icono}</p>
              <p className="uppercase tracking-widest text-xs font-bold" style={{ color: "#F0A8B6" }}>
                {valor.titulo}
              </p>
              <p className="text-white/65 text-sm mt-2">{valor.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━ QUIÉNES SOMOS ━━━ */}
      <section id="nosotros" className="py-20 px-6" style={{ backgroundColor: "#160B24" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Quiénes somos
        </motion.h2>

        <p className="max-w-2xl mx-auto text-center text-white/70">
          Somos Rysteam, un equipo de estudiantes nicaragüenses que creamos DignaLearn para el Hackathon Nicaragua 2026. Nuestra misión: fortalecer la enseñanza de los Derechos y Dignidad de la Mujer con tecnología accesible y cercana.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {EQUIPO.map((miembro, idx) => (
            <motion.div
              key={miembro.nombre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 text-center w-40"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-3xl mb-2" aria-hidden>{miembro.emoji}</p>
              <p className="text-sm font-semibold text-white">{miembro.nombre}</p>
              <p className="text-xs mt-1" style={{ color: miembro.color }}>{miembro.rol}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          Hecho con ❤️ en Nicaragua · Hackathon Nicaragua 2026
        </p>
      </section>

      {/* ━━━ CTA FINAL ━━━ */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "linear-gradient(180deg, #160B24, #1a0f2e)" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          ¿Listo para empezar?
        </motion.h2>
        <p className="text-white/60 mt-4">
          Tu código de acceso te espera. Pedíselo a tu docente.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block mt-10"
        >
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(240,168,182,0.5)" }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="block bg-[#F0A8B6] text-[#160B24] font-bold text-xl px-10 py-5 rounded-full"
            >
              Ingresar a DignaLearn →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="py-10 px-6" style={{ backgroundColor: "#0d0718" }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <LogoDignaLearn size={28} showWordmark={true} darkBackground={true} />
            <p className="text-white/40 text-xs mt-2">
              Contenido basado en documentos oficiales del MINED Nicaragua
            </p>
          </div>

          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacidad" className="hover:text-white/80 transition-colors">Política de privacidad</Link>
            <Link href="/terminos" className="hover:text-white/80 transition-colors">Términos de uso</Link>
            <Link href="/contacto" className="hover:text-white/80 transition-colors">Contacto</Link>
          </div>

          <p className="text-white/40 text-xs">
            © 2026 DignaLearn — Equipo Rysteam
          </p>
        </div>
      </footer>
    </div>
  );
}
