"use client";

interface LogroIconoProps {
  tipo_condicion: string;
  nivel: string;
  size?: number;
}

// Colores del branding de Sharis
const ROSA = "#F0A8B6";
const CELESTE = "#A4CDD5";
const PURPURA = "#160B24";

export default function LogroIcono({ tipo_condicion, nivel, size = 48 }: LogroIconoProps) {
  const s = size;

  // Logros de tema — ícono pequeño rosa
  if (nivel === "tema") {
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="22" fill={ROSA} fillOpacity="0.15" stroke={ROSA} strokeWidth="1.5"/>
        <path d="M24 14l2.5 7.5H34l-6 4.5 2.5 7.5L24 29l-6.5 4.5 2.5-7.5-6-4.5h7.5L24 14z" fill={ROSA}/>
      </svg>
    );
  }

  // Logros de unidad — ícono diferente según cuál unidad
  if (nivel === "unidad") {
    if (tipo_condicion === "unidad_completada") {
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="24" cy="24" r="22" fill={PURPURA} fillOpacity="0.12" stroke={PURPURA} strokeWidth="1.5"/>
          <path d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S30.627 12 24 12zm-2 17l-5-5 1.41-1.41L22 26.17l7.59-7.59L31 20l-9 9z" fill={PURPURA}/>
        </svg>
      );
    }
  }

  // Logros especiales — por tipo
  if (tipo_condicion === "primer_tema") {
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="22" fill={CELESTE} fillOpacity="0.15" stroke={CELESTE} strokeWidth="1.5"/>
        <path d="M24 14v20M14 24h20" stroke={CELESTE} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="4" fill={CELESTE}/>
      </svg>
    );
  }

  if (tipo_condicion === "racha_dias") {
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="22" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M24 12c0 0-8 6-8 13a8 8 0 0016 0c0-7-8-13-8-13z" fill="#F59E0B"/>
        <path d="M24 26c0 0-3 2-3 5a3 3 0 006 0c0-3-3-5-3-5z" fill="white" fillOpacity="0.7"/>
      </svg>
    );
  }

  if (tipo_condicion === "grado_completo" || tipo_condicion === "protagonismo_nicaragua") {
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="22" fill={PURPURA} fillOpacity="0.15" stroke={PURPURA} strokeWidth="1.5"/>
        <path d="M24 13l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" fill={PURPURA}/>
        <circle cx="24" cy="24" r="3" fill={ROSA}/>
      </svg>
    );
  }

  if (tipo_condicion === "ojo_alerta") {
    return (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="24" cy="24" r="22" fill={CELESTE} fillOpacity="0.15" stroke={CELESTE} strokeWidth="1.5"/>
        <path d="M12 24s4-8 12-8 12 8 12 8-4 8-12 8-12-8-12-8z" stroke={CELESTE} strokeWidth="1.5" fill="none"/>
        <circle cx="24" cy="24" r="4" fill={CELESTE}/>
        <circle cx="25.5" cy="22.5" r="1.5" fill="white" fillOpacity="0.7"/>
      </svg>
    );
  }

  // Fallback — estrella genérica
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="24" cy="24" r="22" fill={ROSA} fillOpacity="0.15" stroke={ROSA} strokeWidth="1.5"/>
      <path d="M24 14l2.5 7.5H34l-6 4.5 2.5 7.5L24 29l-6.5 4.5 2.5-7.5-6-4.5h7.5L24 14z" fill={ROSA}/>
    </svg>
  );
}
