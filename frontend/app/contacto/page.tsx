"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PaginaLegal from "@/components/ui/PaginaLegal";

const ELEMENTOS = [
  { simbolo:"♀",  top:"10%",   right:"5%",  color:"#F0A8B6", size:"6rem",  duracion:5,   animacion:{ y:[0,-20,0] } },
  { simbolo:"★",  top:"8%",    left:"3%",   color:"#A4CDD5", size:"5rem",  duracion:4,   animacion:{ y:[0,-15,0], rotate:[0,8,0] } },
  { simbolo:"⚖",  bottom:"15%",left:"4%",   color:"#F0A8B6", size:"4.5rem",duracion:6,   animacion:{ y:[0,-12,0] } },
  { simbolo:"✏",  bottom:"10%",right:"6%",  color:"#A4CDD5", size:"3.5rem",duracion:4.5, animacion:{ y:[0,-10,0], rotate:[0,15,0] } },
  { simbolo:"♀",  top:"50%",   right:"10%", color:"#A4CDD5", size:"5rem",  duracion:7,   animacion:{ y:[0,-18,0] } },
  { simbolo:"♥",  top:"45%",   left:"2%",   color:"#F0A8B6", size:"4rem",  duracion:5.5, animacion:{ y:[0,-8,0], scale:[1,1.1,1] } },
];

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [mensaje, setMensaje] = useState("");

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl
    px-4 py-3 text-white placeholder:text-white/30 text-sm
    focus:outline-none focus:border-[#F0A8B6]/50 transition-colors`;

  const handleEnviar = () => {
    const subject = encodeURIComponent(`Mensaje de ${nombre || "un visitante"}`);
    const body    = encodeURIComponent(
      `Nombre: ${nombre}\nCorreo: ${email || "No indicado"}\n\n${mensaje}`
    );
    window.open(`mailto:contacto@dignalearn.com?subject=${subject}&body=${body}`);
  };

  const EQUIPO = [
    { label:"✉️ Correo electrónico",     color:"#F0A8B6",
      valor:"contacto@dignalearn.com",
      accion: <a href="mailto:contacto@dignalearn.com"
                 className="text-[#F0A8B6]/60 hover:text-[#F0A8B6] text-xs transition-colors">
                Enviar correo →
              </a> },
    { label:"🏆 Hackathon Nicaragua 2026", color:"#A4CDD5",
      valor:"DignaLearn es un proyecto desarrollado para el Hackathon Nicaragua 2026 por el Equipo Rysteam.",
      accion: null },
    { label:"💻 Repositorio",             color:"#F0A8B6",
      valor:"github.com/Rysteam-hackathon/DignaLearn",
      accion: null },
    { label:"👥 Equipo Rysteam",          color:"#A4CDD5",
      valor:"Dirk Martinez · Eddy Marenco · Ronald Dávila · Sharis Peralta · Sidar Perez",
      accion: null },
  ];

  return (
    <PaginaLegal
      badge="✉️ Hablemos"
      titulo="Contacto"
      subtitulo="Estamos construyendo algo que importa. Escribinos."
      elementos={ELEMENTOS}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">

        {/* Columna izquierda — info */}
        <div className="space-y-8">
          {EQUIPO.map((item, idx) => (
            <motion.div
              key={idx}
              className="border-l-2 pl-4"
              style={{ borderColor: item.color }}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type:"spring", stiffness:280, damping:22,
                            delay: idx * 0.08 }}
            >
              <p className="font-semibold text-sm mb-1"
                 style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-white/70 text-sm">{item.valor}</p>
              {item.accion && <div className="mt-1">{item.accion}</div>}
            </motion.div>
          ))}
        </div>

        {/* Columna derecha — formulario */}
        <motion.div
          className="border border-white/10 rounded-2xl p-8 bg-white/[0.03]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type:"spring", stiffness:280, damping:22, delay:0.1 }}
        >
          <h2 className="text-white font-semibold text-lg mb-6">
            Dejanos un mensaje
          </h2>

          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className={inputClass + " mb-4"}
          />
          <input
            type="email"
            placeholder="Tu correo (opcional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass + " mb-4"}
          />
          <textarea
            placeholder="¿En qué podemos ayudarte?"
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            rows={4}
            className={inputClass + " mb-6 resize-none"}
          />

          <motion.button
            onClick={handleEnviar}
            className="w-full bg-[#F0A8B6] text-[#160B24] font-bold
                       py-3 rounded-xl text-sm cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enviar mensaje →
          </motion.button>

          <p className="text-white/30 text-xs text-center mt-3">
            Al enviar, se abrirá tu cliente de correo con el mensaje prellenado.
          </p>
        </motion.div>
      </div>
    </PaginaLegal>
  );
}
