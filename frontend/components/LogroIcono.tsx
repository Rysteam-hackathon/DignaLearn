"use client";

import { useId } from "react";
import { motion } from "framer-motion";

const ROSA = "#F0A8B6";
const CELESTE = "#A4CDD5";
const PURPURA = "#160B24";
const BLANCO = "#FFFFFF";
const NARANJA = "#FF8C42";

interface LogroIconoProps {
  tipo_condicion: string;
  nivel: string;
  size?: number;
  animado?: boolean; // false = solo el SVG estático, sin loop
  nombre_logro?: string;
  condicion_valor?: number;
  logro_id?: string;
}

// Mapeo directo por logro_id — usado solo para los logros de nivel "tema"
// (34 logros específicos, uno por tema real de 7mo y 9no). Los nombres son
// demasiado parecidos entre sí para desambiguar con .includes() como se hace
// con unidad_completada, así que acá se necesita un ID exacto por fila.
// El logro genérico viejo ("¡Tema completado!", a2d2510a-...) no está en este
// mapa a propósito: cae al <IconoTema /> de fallback para no romper el
// historial otorgado antes de esta migración.
const CATEGORIA_POR_LOGRO_ID: Record<string, string> = {
  // 7mo grado
  "90cc77dd-e73e-4c29-8614-2ac288817642": "corazon-laureles", // Con Dignidad
  "d3760018-a429-4a15-b4b2-54c834dd5a06": "corazon-laureles", // Dignidad en Todo Ámbito
  "bcc99d76-e75e-4e92-afb3-3fa73ce68508": "corazon-laureles", // Dignidad Cotidiana
  "e309ff3a-7287-4ee9-a4e7-471662e72e7d": "flor-tejido", // Raíces y Cultura
  "cdc5281b-6c7d-4614-b39a-bba2cb7e953d": "manos-balanza", // Conocedores de las Leyes
  "33449cf0-3345-403f-9bcc-d577d9dea5e6": "escudo", // Ley Integral
  "da187c5e-36aa-45db-bb86-483de1656882": "escudo", // Alerta Temprana
  "3a99f444-3d4a-482a-b0a5-8574ed004539": "escudo", // Sé Cómo Denunciar
  "c6ae3254-c0b2-4735-b380-95c9206ba3cf": "balanza-figuras", // Complementariedad en Casa
  "fca04ce4-c094-4ae2-baca-f5f2218ba22d": "simbolo-igualdad", // Igualdad en Acción
  "0cab443f-8611-42bd-94f6-51aff0ab511f": "balanza-figuras", // Roles Compartidos
  "9e08f118-b629-4260-add4-e02d741b7ad9": "balanza-figuras", // Rompiendo Estereotipos
  "21ed67b6-99cf-40ba-8185-8ac461cefc23": "simbolo-igualdad", // Ley de Igualdad
  "2fefa507-9c80-4e35-a1d4-567dad15eefe": "estrella-silueta", // Nace un Liderazgo
  "b63624cf-bf36-4bfe-be6a-f63eca23f0ea": "estrella-silueta", // Lideresa en Marcha
  "55759f73-e827-4bf3-b055-46a42a4d70e4": "estrella-silueta", // Protagonismo Nica
  "a1d52c5a-3496-4263-8667-cea14a4b53d1": "estrella-silueta", // Mujeres que Inspiran
  // 9no grado
  "1d8bc4d9-6df0-49ff-9a24-dcae6927d2b6": "corazon-laureles", // Papel en la Sociedad
  "1ae465c5-3821-437e-bf06-b6a8be9db7be": "corazon-laureles", // En Todo Ámbito
  "ede5606d-e12a-4715-8f9f-f194a3522bc6": "corazon-laureles", // Sociedad con Dignidad
  "96be5972-deb0-4d9f-9a27-e17a944c21d4": "flor-tejido", // Cultura de Paz
  "1a16d3b1-9404-4ac3-90e8-d87e7d8b640d": "manos-balanza", // Protegidas por la Ley
  "19e3f2b8-4f09-422b-84b6-6c04c54877a3": "simbolo-igualdad", // Ley de Igualdad Plena
  "548f42be-b53b-48de-8df8-a16050cd430d": "escudo", // Alerta Temprana
  "d8dd02b4-81c0-4196-a740-954f97cce9d2": "escudo", // Sé Cómo Denunciar
  "b23c632d-025f-49fa-9cc5-9168bd6dfdc5": "balanza-figuras", // Equidad y Solidaridad
  "72dde93e-0ade-4995-b30c-c27b8adba9c2": "simbolo-igualdad", // Procesos de Cambio
  "69b2be1d-b7b0-4940-bc3d-9f9e56e45ba9": "balanza-figuras", // Influencia Social
  "c762080e-26c4-481d-9055-854bf77eb9e0": "balanza-figuras", // Relaciones que Suman
  "7fe07846-dedc-4ae4-8651-93b3434d123f": "simbolo-igualdad", // Ley en lo Social
  "bc1375e2-5d86-47f2-a64a-6e3383f7ef7c": "maletin-estrella", // Empoderamiento Laboral
  "71cf2893-d7e1-47aa-9525-4701ee7ffb2a": "maletin-estrella", // Igualdad en el Trabajo
  "5e6deb5f-d506-483a-99b1-00c9299fe3db": "maletin-estrella", // Frente al Trabajo
  "d229ee26-7ab6-47a4-87c2-a7e60e48d05e": "estrella-silueta", // Mujeres de Historia
};

interface IconoProps {
  size: number;
  animado: boolean;
}

// ── CASO 1 — nivel "tema" (genérico para todos los temas) ──────────────────
function IconoTema({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { rotate: [0, 10, -10, 0] } : undefined}
        transition={animado ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="24" cy="24" r="22" fill={ROSA} fillOpacity="0.12" />
        <path d="M24 14l2.5 7.5H34l-6 4.5 2.5 7.5L24 29l-6.5 4.5 2.5-7.5-6-4.5h7.5L24 14z" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 2 — "primer_tema" (El Primer Paso) ─────────────────────────────────
function IconoPrimerPaso({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { x: [0, 4, 0] } : undefined}
        transition={animado ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="15" cy="32" r="5" fill={CELESTE} />
        <circle cx="10" cy="20" r="2.8" fill={CELESTE} />
        <circle cx="16" cy="15" r="3" fill={CELESTE} />
        <circle cx="23" cy="13" r="2.8" fill={CELESTE} />
        <circle cx="29" cy="16" r="2.5" fill={CELESTE} />
        <path d="M30 26q7 0 11-2" stroke={ROSA} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M37 21l4 3-4 3" stroke={ROSA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 3 — unidad_completada / Dignidad (Unidad I) ────────────────────────
function IconoUnidadDignidad({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { scale: [1, 1.08, 1] } : undefined}
        transition={animado ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M24 34s-11-7.5-11-15.5C13 13 17 10 21 12c1.5.8 3 2.5 3 2.5s1.5-1.7 3-2.5c4-2 8 1 8 6.5C35 26.5 24 34 24 34z"
              fill={ROSA} stroke={PURPURA} strokeWidth="1.2" strokeLinejoin="round" />
        <g fill={PURPURA} fillOpacity="0.7">
          <ellipse cx="9" cy="24" rx="3" ry="1.6" transform="rotate(-25 9 24)" />
          <ellipse cx="7" cy="19" rx="2.6" ry="1.4" transform="rotate(-45 7 19)" />
          <ellipse cx="8" cy="14" rx="2.2" ry="1.2" transform="rotate(-65 8 14)" />
        </g>
        <g fill={PURPURA} fillOpacity="0.7">
          <ellipse cx="39" cy="24" rx="3" ry="1.6" transform="rotate(25 39 24)" />
          <ellipse cx="41" cy="19" rx="2.6" ry="1.4" transform="rotate(45 41 19)" />
          <ellipse cx="40" cy="14" rx="2.2" ry="1.2" transform="rotate(65 40 14)" />
        </g>
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 4 — unidad_completada / Ley (Unidad II) ────────────────────────────
function IconoUnidadLey({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ rotate: -10, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { rotate: [-3, 3, -3] } : undefined}
        transition={animado ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="24" cy="8" r="2.5" fill={CELESTE} />
        <line x1="24" y1="10" x2="24" y2="36" stroke={CELESTE} strokeWidth="2" />
        <line x1="10" y1="14" x2="38" y2="14" stroke={CELESTE} strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="14" x2="12" y2="22" stroke={CELESTE} strokeWidth="1.5" />
        <line x1="36" y1="14" x2="36" y2="22" stroke={CELESTE} strokeWidth="1.5" />
        <path d="M6 22Q12 30 18 22" stroke={CELESTE} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M30 22Q36 30 42 22" stroke={CELESTE} strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="18,42 30,42 24,35" fill={CELESTE} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 5 — unidad_completada / Equidad (Unidad III) ───────────────────────
function IconoUnidadEquidad({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { y: [0, -4, 0] } : undefined}
        transition={animado ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="16" cy="14" r="4" fill={ROSA} />
        <rect x="11" y="19" width="10" height="16" rx="5" fill={ROSA} />
        <circle cx="32" cy="14" r="4" fill={CELESTE} />
        <rect x="27" y="19" width="10" height="16" rx="5" fill={CELESTE} />
        <line x1="21" y1="27" x2="27" y2="27" stroke={PURPURA} strokeWidth="2.5" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 6 — unidad_completada / Líderes (Unidad IV) ────────────────────────
function IconoUnidadLideres({ size, animado }: IconoProps) {
  const gradId = useId();
  return (
    <motion.div
      initial={{ rotate: 0, scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { rotate: [0, 5, 0, -5, 0] } : undefined}
        transition={animado ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor={ROSA} />
            <stop offset="100%" stopColor={CELESTE} />
          </linearGradient>
        </defs>
        <path d="M24 8L34 28H14Z" fill={`url(#${gradId})`} />
        <path d="M24 40L14 20H34Z" fill={`url(#${gradId})`} />
        <circle cx="24" cy="21" r="2.5" fill={PURPURA} />
        <path d="M24 23.5c-4 0-6 6.5-7 9.5h14c-1-3-3-9.5-7-9.5z" fill={PURPURA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 7 — racha_dias ≤5 (Constante) ──────────────────────────────────────
function IconoRachaConstante({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { scale: [1, 1.1, 1], y: [0, -2, 0] } : undefined}
        transition={animado ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M24 10c-4 5-9 11-9 18a9 9 0 0018 0c0-7-5-13-9-18z" fill={NARANJA} />
        <path d="M24 24c-1.7 2.3-3.5 4.6-3.5 7.5a3.5 3.5 0 007 0c0-2.9-1.8-5.2-3.5-7.5z" fill={BLANCO} fillOpacity="0.6" />
        <circle cx="14" cy="16" r="1.5" fill={ROSA} />
        <circle cx="34" cy="18" r="1.3" fill={ROSA} />
        <circle cx="30" cy="9" r="1.2" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 8 — racha_dias ≤7 (Semana Activa) ──────────────────────────────────
function IconoRachaSemana({ size, animado }: IconoProps) {
  const posiciones = [4, 10.7, 17.3, 24, 30.7, 37.3, 44];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
        {posiciones.map((cx, idx) => {
          const color = idx % 2 === 0 ? ROSA : CELESTE;
          return (
            <motion.g
              key={idx}
              initial={{ x: -10, opacity: 0 }}
              animate={animado ? { x: 0, opacity: 1, y: [0, -4, 0] } : { x: 0, opacity: 1 }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 20, delay: idx * 0.08 },
                opacity: { duration: 0.3, delay: idx * 0.08 },
                y: animado ? { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 + idx * 0.15 } : undefined,
              }}
            >
              <circle cx={cx} cy="24" r="3.2" fill={color} />
              <path d={`M${cx - 1.4} 24l1 1.2 2-2.4`} stroke={BLANCO} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}

// ── CASO 9 — racha_dias >7 (Imparable) ──────────────────────────────────────
function IconoRachaImparable({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ y: 20, scale: 0.5, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { y: [0, -8, 0] } : undefined}
        transition={animado ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M24 8c4 4 6 10 6 16v8H18v-8c0-6 2-12 6-16z" fill={CELESTE} />
        <circle cx="24" cy="20" r="2.5" fill={BLANCO} fillOpacity="0.85" />
        <path d="M18 32l-5 6h5z" fill={PURPURA} />
        <path d="M30 32l5 6h-5z" fill={PURPURA} />
        <path d="M20 38c1 3 2.5 5 4 6 1.5-1 3-3 4-6-2 1-6 1-8 0z" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 10 — "logros_unidad" (Coleccionista) ───────────────────────────────
function IconoColeccionista({ size, animado }: IconoProps) {
  const medallas = [
    { cx: 17, cy: 17, r: 6, color: PURPURA },
    { cx: 24, cy: 22, r: 7, color: CELESTE },
    { cx: 31, cy: 28, r: 8, color: ROSA },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { rotate: [-5, 5, -5] } : undefined}
        transition={animado ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {medallas.map((m, idx) => (
          <motion.g
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: idx * 0.15 }}
            style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
          >
            <path d={`M${m.cx - 2} ${m.cy + m.r}l2 4 2-4z`} fill={m.color} fillOpacity="0.8" />
            <circle cx={m.cx} cy={m.cy} r={m.r} fill={m.color} />
            <path
              d={`M${m.cx} ${m.cy - m.r * 0.5}l${m.r * 0.18} ${m.r * 0.5}h${m.r * 0.5}l-${m.r * 0.4} ${m.r * 0.3} ${m.r * 0.18} ${m.r * 0.5}-${m.r * 0.46} ${m.r * 0.3}-${m.r * 0.46}-${m.r * 0.3} ${m.r * 0.18}-${m.r * 0.5}-${m.r * 0.4}-${m.r * 0.3}h${m.r * 0.5}z`}
              fill={BLANCO}
              fillOpacity="0.85"
            />
          </motion.g>
        ))}
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 11 — "ojo_alerta" (Ojo Alerta) ─────────────────────────────────────
function IconoOjoAlerta({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { scale: [1, 1.05, 1] } : undefined}
        transition={animado ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M4 24s7-11 20-11 20 11 20 11-7 11-20 11S4 24 4 24z" fill={BLANCO} fillOpacity="0.5" stroke={PURPURA} strokeWidth="1.5" />
        <motion.circle
          cx="24" cy="24" r="7" fill={CELESTE}
          animate={animado ? { scale: [1, 1.15, 1] } : undefined}
          transition={animado ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
          style={{ transformOrigin: "24px 24px" }}
        />
        <circle cx="24" cy="24" r="3" fill={PURPURA} />
        <path d="M6 6l2.5 2.5M42 6l-2.5 2.5M6 42l2.5-2.5M42 42l-2.5-2.5" stroke={ROSA} strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 12 — "grado_completo" (Seriamente) ─────────────────────────────────
function IconoGradoCompleto({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { y: [0, -3, 0] } : undefined}
        transition={animado ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="10" cy="24" r="5" fill={BLANCO} stroke={CELESTE} strokeWidth="1.5" />
        <circle cx="38" cy="24" r="5" fill={BLANCO} stroke={CELESTE} strokeWidth="1.5" />
        <rect x="10" y="19" width="28" height="10" fill={BLANCO} stroke={CELESTE} strokeWidth="1.5" />
        <path d="M20 29l4 6-4 3z" fill={ROSA} />
        <path d="M28 29l-4 6 4 3z" fill={ROSA} />
        <circle cx="24" cy="30" r="1.5" fill={ROSA} />
        <path d="M24 6l1.4 3.2 3.4.3-2.6 2.3.8 3.4L24 13.4l-2.9 1.8.8-3.4-2.6-2.3 3.4-.3z" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 13 — "protagonismo_nicaragua" ──────────────────────────────────────
function IconoProtagonismo({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? {
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 2px rgba(240,168,182,0.3))",
            "drop-shadow(0 0 8px rgba(240,168,182,0.8))",
            "drop-shadow(0 0 2px rgba(240,168,182,0.3))",
          ],
        } : undefined}
        transition={animado ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path
          d="M10 14C8 20 14 22 16 28C18 34 26 36 30 40C34 42 40 38 38 32C36 26 30 24 28 18C26 12 16 8 10 14Z"
          fill={CELESTE}
        />
        <path d="M23 22l1.4 3.2 3.4.3-2.6 2.3.8 3.4L23 29.4l-2.9 1.8.8-3.4-2.6-2.3 3.4-.3z" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 15 — categoría "escudo" (leyes de protección / denuncia / alerta) ──
function IconoEscudo({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { y: [0, -3, 0] } : undefined}
        transition={animado ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d="M24 6l14 5v11c0 10-6 17-14 20-8-3-14-10-14-20V11z" fill={CELESTE} stroke={PURPURA} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M17 24l5 5 9-11" stroke={BLANCO} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 16 — categoría "simbolo-igualdad" (igualdad de género / de derechos) ──
function IconoSimboloIgualdad({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { scale: [1, 1.08, 1] } : undefined}
        transition={animado ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <circle cx="24" cy="24" r="22" fill={PURPURA} fillOpacity="0.06" />
        <rect x="10" y="18" width="28" height="4.5" rx="2.25" fill={ROSA} />
        <rect x="10" y="27" width="28" height="4.5" rx="2.25" fill={CELESTE} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 17 — categoría "flor-tejido" (identidad indígena / afrodescendiente / cultura de paz) ──
function IconoFlorTejido({ size, animado }: IconoProps) {
  const petalos = [0, 60, 120, 180, 240, 300];
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { rotate: [0, 8, -8, 0] } : undefined}
        transition={animado ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
        style={{ transformOrigin: "24px 24px" }}
      >
        {petalos.map((angulo, idx) => (
          <ellipse
            key={angulo}
            cx="24" cy="13" rx="5" ry="8"
            fill={idx % 2 === 0 ? ROSA : CELESTE}
            transform={`rotate(${angulo} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="5" fill={NARANJA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 18 — categoría "maletin-estrella" (empoderamiento e igualdad laboral) ──
function IconoMaletinEstrella({ size, animado }: IconoProps) {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <motion.svg
        width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden
        animate={animado ? { y: [0, -3, 0] } : undefined}
        transition={animado ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <rect x="8" y="18" width="32" height="20" rx="3" fill={CELESTE} stroke={PURPURA} strokeWidth="1.2" />
        <path d="M18 18v-4a3 3 0 013-3h6a3 3 0 013 3v4" stroke={PURPURA} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="8" y="26" width="32" height="4" fill={PURPURA} fillOpacity="0.15" />
        <path d="M24 24l1.4 3.2 3.4.3-2.6 2.3.8 3.4-3-1.8-3 1.8.8-3.4-2.6-2.3 3.4-.3z" fill={ROSA} />
      </motion.svg>
    </motion.div>
  );
}

// ── CASO 14 — fallback genérico ─────────────────────────────────────────────
function IconoFallback({ size }: { size: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
        <circle cx="24" cy="24" r="22" fill={ROSA} fillOpacity="0.15" stroke={ROSA} strokeWidth="1.5" />
        <path d="M24 14l2.5 7.5H34l-6 4.5 2.5 7.5L24 29l-6.5 4.5 2.5-7.5-6-4.5h7.5L24 14z" fill={ROSA} />
      </svg>
    </motion.div>
  );
}

export default function LogroIcono({
  tipo_condicion,
  nivel,
  size = 48,
  animado = true,
  nombre_logro,
  condicion_valor,
  logro_id,
}: LogroIconoProps) {
  const props: IconoProps = { size, animado };

  if (nivel === "tema") {
    const categoria = logro_id ? CATEGORIA_POR_LOGRO_ID[logro_id] : undefined;
    if (categoria === "corazon-laureles") return <IconoUnidadDignidad {...props} />;
    if (categoria === "manos-balanza") return <IconoUnidadLey {...props} />;
    if (categoria === "balanza-figuras") return <IconoUnidadEquidad {...props} />;
    if (categoria === "estrella-silueta") return <IconoUnidadLideres {...props} />;
    if (categoria === "escudo") return <IconoEscudo {...props} />;
    if (categoria === "simbolo-igualdad") return <IconoSimboloIgualdad {...props} />;
    if (categoria === "flor-tejido") return <IconoFlorTejido {...props} />;
    if (categoria === "maletin-estrella") return <IconoMaletinEstrella {...props} />;
    // Sin categoría asignada: logro genérico viejo ("¡Tema completado!") u
    // otro logro de tema sin mapear — se conserva el ícono genérico de siempre.
    return <IconoTema {...props} />;
  }

  if (tipo_condicion === "primer_tema") return <IconoPrimerPaso {...props} />;

  if (tipo_condicion === "unidad_completada") {
    if (nombre_logro?.includes("Dignidad")) return <IconoUnidadDignidad {...props} />;
    if (nombre_logro?.includes("Ley")) return <IconoUnidadLey {...props} />;
    if (nombre_logro?.includes("Equidad")) return <IconoUnidadEquidad {...props} />;
    if (nombre_logro?.includes("Líderes")) return <IconoUnidadLideres {...props} />;
    return <IconoUnidadDignidad {...props} />;
  }

  if (tipo_condicion === "racha_dias") {
    if (typeof condicion_valor === "number" && condicion_valor <= 5) return <IconoRachaConstante {...props} />;
    if (typeof condicion_valor === "number" && condicion_valor <= 7) return <IconoRachaSemana {...props} />;
    return <IconoRachaImparable {...props} />;
  }

  if (tipo_condicion === "logros_unidad") return <IconoColeccionista {...props} />;

  if (tipo_condicion === "ojo_alerta") return <IconoOjoAlerta {...props} />;

  if (tipo_condicion === "grado_completo") return <IconoGradoCompleto {...props} />;

  if (tipo_condicion === "protagonismo_nicaragua") return <IconoProtagonismo {...props} />;

  return <IconoFallback size={size} />;
}
