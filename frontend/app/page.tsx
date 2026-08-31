"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  { emoji: "📖", titulo: "Contenido del MINED", descripcion: "Lectura, actividades y reflexiones basadas en el currículo oficial de Nicaragua para 7mo y 9no grado." },
  { emoji: "🏆", titulo: "Sistema de logros", descripcion: "Completá temas y desbloqueá logros. Cada avance se celebra con animaciones y reconocimientos." },
  { emoji: "🔥", titulo: "Racha diaria", descripcion: "Estudiá cada día y mantené tu racha activa. La constancia construye el conocimiento." },
  { emoji: "👩‍🏫", titulo: "Panel del docente", descripcion: "Los docentes crean estudiantes, ven el progreso grupal e individual en tiempo real." },
];

const GRADOS_DISPONIBLES = [
  { grado: "7mo", nivel: "Secundaria" },
  { grado: "9no", nivel: "Secundaria" },
];

const GRADOS_PROXIMAMENTE = [
  { grado: "Primaria", nivel: "1ro – 6to grado" },
  { grado: "8vo", nivel: "Secundaria" },
  { grado: "10mo", nivel: "Secundaria" },
  { grado: "11vo", nivel: "Secundaria" },
];

const PASOS = [
  { numero: "01", titulo: "El docente crea tu cuenta", descripcion: "Recibís un código único DL-XXXX y un PIN de 4 dígitos." },
  { numero: "02", titulo: "Ingresás a la plataforma", descripcion: "Usás tu código y PIN para entrar. Sin correo ni contraseña complicada." },
  { numero: "03", titulo: "Aprendés y jugás", descripcion: "Leés, completás la sopa de letras, respondés el quiz y reflexionás." },
  { numero: "04", titulo: "Desbloqueás logros", descripcion: "Cada tema dominado suma logros y mantiene tu racha activa." },
];

function CardGradoDisponible({ grado, nivel, delay }: { grado: string; nivel: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 45px rgba(240,168,182,0.25)" }}
      className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5"
      style={{
        background: "linear-gradient(135deg, rgba(240,168,182,0.16), rgba(240,168,182,0.04))",
        border: "1px solid rgba(240,168,182,0.25)",
      }}
    >
      <motion.div
        className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{ backgroundColor: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.35)" }}
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ✅ Disponible
      </motion.div>

      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0" style={{backgroundColor:"#F0A8B6",color:"#160B24"}}>
        {grado}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold" style={{color:"#F0A8B6"}}>{grado} grado</h3>
        <p className="text-sm" style={{color:"rgba(255,255,255,0.6)"}}>{nivel}</p>
      </div>
      <Link href="/login" className="btn-hover rounded-xl px-4 py-2 text-sm font-semibold shrink-0" style={{backgroundColor:"#F0A8B6",color:"#160B24"}}>
        Ingresar →
      </Link>
    </motion.div>
  );
}

function CardGradoProximamente({ grado, nivel, delay }: { grado: string; nivel: string; delay: number }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.015 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="relative rounded-2xl p-5 text-center"
      style={{
        backgroundColor: "rgba(164,205,213,0.06)",
        border: "1px solid rgba(164,205,213,0.2)",
        opacity: 0.8,
      }}
    >
      <div
        className="badge-proximamente inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-4"
        style={{backgroundColor:"rgba(164,205,213,0.15)",color:"#A4CDD5",border:"1px solid rgba(164,205,213,0.3)"}}
      >
        ✨ Próximamente
      </div>
      <h3 className="text-base font-bold mb-1" style={{color:"#A4CDD5"}}>{grado}</h3>
      <p className="text-xs" style={{color:"rgba(255,255,255,0.5)"}}>{nivel}</p>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg pointer-events-none z-10"
            style={{backgroundColor:"#160B24", color:"#A4CDD5", border:"1px solid rgba(164,205,213,0.3)"}}
          >
            ¡Pronto disponible!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#160B24", color: "#FFFFFF" }}>
      <style>{`
        @keyframes flotar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes flotar2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(3deg)} }
        @keyframes entrar { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
        .badge-proximamente{animation:badge-pulse 2s ease-in-out infinite}
        .flota1{animation:flotar 6s ease-in-out infinite}
        .flota2{animation:flotar2 8s ease-in-out infinite}
        .flota3{animation:flotar 10s ease-in-out infinite reverse}
        .card-hover{transition:transform 250ms ease,box-shadow 250ms ease}
        .card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(240,168,182,0.15)}
        .btn-hover{transition:transform 150ms ease,opacity 150ms ease}
        .btn-hover:hover{transform:translateY(-2px);opacity:0.92}
        .btn-hover:active{transform:translateY(0)}
      `}</style>

      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <p className="text-xl font-bold">Digna<span style={{color:"#A4CDD5"}}>Learn</span></p>
        <Link href="/login" className="btn-hover rounded-xl px-5 py-2 text-sm font-semibold" style={{backgroundColor:"#F0A8B6",color:"#160B24"}}>
          Ingresar →
        </Link>
      </nav>

      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="flota1 absolute rounded-full opacity-10" style={{width:500,height:500,background:"#F0A8B6",top:-150,left:-150}}/>
          <div className="flota2 absolute rounded-full opacity-10" style={{width:350,height:350,background:"#A4CDD5",bottom:-100,right:-100}}/>
          <div className="flota3 absolute rounded-full opacity-5" style={{width:200,height:200,background:"#F0A8B6",top:"40%",right:"15%"}}/>
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto" style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:"all 800ms ease"}}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mb-8" style={{backgroundColor:"rgba(240,168,182,0.15)",color:"#F0A8B6",border:"1px solid rgba(240,168,182,0.3)"}}>
            ✨ Plataforma educativa del MINED Nicaragua
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Aprendé tus <span style={{color:"#F0A8B6"}}>derechos</span><br/>jugando
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto" style={{color:"rgba(255,255,255,0.7)"}}>
            DignaLearn es la experiencia educativa gamificada para la asignatura <strong style={{color:"#A4CDD5"}}>Derechos y Dignidad de la Mujer</strong>, disponible para primaria y secundaria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-hover rounded-2xl px-8 py-4 text-base font-bold" style={{backgroundColor:"#F0A8B6",color:"#160B24"}}>
              Comenzar ahora →
            </Link>
            <a href="#como-funciona" className="btn-hover rounded-2xl px-8 py-4 text-base font-semibold" style={{backgroundColor:"rgba(255,255,255,0.08)",color:"#ffffff",border:"1px solid rgba(255,255,255,0.15)"}}>
              ¿Cómo funciona?
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[{num:"34",label:"Temas del MINED"},{num:"135",label:"Actividades"},{num:"45",label:"Logros posibles"},{num:"2",label:"Grados"}].map((stat)=>(
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold" style={{color:"#F0A8B6"}}>{stat.num}</p>
                <p className="text-xs mt-1" style={{color:"rgba(255,255,255,0.5)"}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{backgroundColor:"rgba(255,255,255,0.03)"}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitás para <span style={{color:"#A4CDD5"}}>aprender</span></h2>
            <p style={{color:"rgba(255,255,255,0.6)"}}>Una plataforma completa diseñada para estudiantes y docentes de secundaria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f)=>(
              <div key={f.titulo} className="card-hover rounded-2xl p-6" style={{backgroundColor:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
                <p className="text-4xl mb-4" aria-hidden>{f.emoji}</p>
                <h3 className="text-lg font-bold mb-2">{f.titulo}</h3>
                <p className="text-sm" style={{color:"rgba(255,255,255,0.6)"}}>{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo <span style={{color:"#F0A8B6"}}>funciona</span>?</h2>
            <p style={{color:"rgba(255,255,255,0.6)"}}>En cuatro pasos simples, estudiantes y docentes están listos para empezar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PASOS.map((paso)=>(
              <div key={paso.numero} className="card-hover rounded-2xl p-6 flex gap-4" style={{backgroundColor:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
                <p className="text-4xl font-bold shrink-0" style={{color:"rgba(240,168,182,0.3)"}}>{paso.numero}</p>
                <div>
                  <h3 className="text-base font-bold mb-1">{paso.titulo}</h3>
                  <p className="text-sm" style={{color:"rgba(255,255,255,0.6)"}}>{paso.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="flota1 absolute rounded-full opacity-10" style={{width:260,height:260,background:"#F0A8B6",top:-60,left:-60}}/>
          <div className="flota2 absolute rounded-full opacity-10" style={{width:220,height:220,background:"#A4CDD5",bottom:-70,right:-70}}/>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Disponible <span style={{color:"#F0A8B6"}}>ahora</span></h2>
            <p style={{color:"rgba(255,255,255,0.6)"}}>Comenzamos con secundaria — 7mo y 9no grado — y pronto sumamos primaria completa y el resto de secundaria.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {GRADOS_DISPONIBLES.map((g, i)=>(
              <CardGradoDisponible key={g.grado} grado={g.grado} nivel={g.nivel} delay={i * 0.1} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {GRADOS_PROXIMAMENTE.map((g, i)=>(
              <CardGradoProximamente key={g.grado} grado={g.grado} nivel={g.nivel} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{backgroundColor:"rgba(255,255,255,0.03)"}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">¿Para <span style={{color:"#A4CDD5"}}>quién</span> es?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-hover rounded-2xl p-8" style={{backgroundColor:"rgba(240,168,182,0.08)",border:"1px solid rgba(240,168,182,0.2)"}}>
              <p className="text-5xl mb-4" aria-hidden>🎓</p>
              <h3 className="text-xl font-bold mb-3" style={{color:"#F0A8B6"}}>Estudiantes</h3>
              <p className="text-sm" style={{color:"rgba(255,255,255,0.7)"}}>De 7mo y 9no grado. Aprendés los derechos de la mujer de forma interactiva, con actividades y logros que hacen el aprendizaje divertido.</p>
            </div>
            <div className="card-hover rounded-2xl p-8" style={{backgroundColor:"rgba(164,205,213,0.08)",border:"1px solid rgba(164,205,213,0.2)"}}>
              <p className="text-5xl mb-4" aria-hidden>👩‍🏫</p>
              <h3 className="text-xl font-bold mb-3" style={{color:"#A4CDD5"}}>Docentes</h3>
              <p className="text-sm" style={{color:"rgba(255,255,255,0.7)"}}>Creás las cuentas de tus estudiantes, ves su progreso individual y grupal en tiempo real desde un panel dedicado.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Listo para <span style={{color:"#F0A8B6"}}>empezar</span></h2>
          <p className="mb-10" style={{color:"rgba(255,255,255,0.6)"}}>Ingresá con tu código de acceso y PIN que te dio tu docente.</p>
          <Link href="/login" className="btn-hover inline-block rounded-2xl px-10 py-4 text-base font-bold" style={{backgroundColor:"#F0A8B6",color:"#160B24"}}>
            Ingresar a DignaLearn →
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 text-center" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <p className="text-sm" style={{color:"rgba(255,255,255,0.4)"}}>© 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026</p>
        <p className="text-xs mt-1" style={{color:"rgba(255,255,255,0.25)"}}>Contenido basado en el currículo oficial del MINED Nicaragua · Ley N° 787</p>
      </footer>
    </div>
  );
}
