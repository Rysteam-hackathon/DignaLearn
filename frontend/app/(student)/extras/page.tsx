"use client";

import { useState, useEffect } from "react";

export default function ExtrasPage() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [esModoOscuro, setEsModoOscuro] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("dignalearn_tema");
    setModoOscuro(guardado === "dark");
  }, []);

  useEffect(() => {
    const actualizar = () => setEsModoOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const observer = new MutationObserver(actualizar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function toggleTema() {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    if (nuevo) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dignalearn_tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dignalearn_tema", "light");
    }
  }

  const cardBg = esModoOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)";
  const cardBorder = esModoOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";
  const textoSecundario = esModoOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";
  const avatarBg = esModoOscuro ? "rgba(240,168,182,0.15)" : "rgba(22,11,36,0.08)";
  const avatarTexto = esModoOscuro ? "#F0A8B6" : "#160B24";

  const cardStyle = { backgroundColor: cardBg, border: `1px solid ${cardBorder}` };

  return (
    <div className="p-5 max-w-3xl mx-auto" style={{ backgroundColor: "var(--background)" }}>
      <style>{`
        @keyframes extras-entrar {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .extras-card {
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .extras-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(240, 168, 182, 0.12);
        }
      `}</style>

      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        Extras
      </h1>

      {/* Configuración */}
      <div
        className="extras-card rounded-2xl p-6 mb-4"
        style={{ ...cardStyle, animation: "extras-entrar 400ms ease forwards" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Configuración
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Modo oscuro
            </p>
            <p className="text-xs mt-0.5" style={{ color: textoSecundario }}>
              Cambia la apariencia de la plataforma
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTema}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
            style={{ backgroundColor: modoOscuro ? "#F0A8B6" : "#D1D5DB" }}
            aria-label={modoOscuro ? "Desactivar modo oscuro" : "Activar modo oscuro"}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: modoOscuro ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>
      </div>

      {/* Acerca de */}
      <div
        className="extras-card rounded-2xl p-6 mb-4"
        style={{ ...cardStyle, animation: "extras-entrar 400ms ease 80ms forwards", opacity: 0, animationFillMode: "forwards" }}
      >
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Acerca de DignaLearn
        </h2>
        <p className="text-sm mb-4" style={{ color: textoSecundario }}>
          Plataforma educativa gamificada para la asignatura &quot;Derechos y Dignidad de la Mujer&quot; del MINED Nicaragua. Fortalecemos el proceso de enseñanza-aprendizaje mediante herramientas tecnológicas que permiten al estudiante y al docente comprender la asignatura.
        </p>
        <p className="text-xs" style={{ color: textoSecundario }}>
          Contenido educativo basado en documentos oficiales del MINED Nicaragua.
        </p>
      </div>

      {/* Equipo */}
      <div
        className="extras-card rounded-2xl p-6 mb-4"
        style={{ ...cardStyle, animation: "extras-entrar 400ms ease 160ms forwards", opacity: 0, animationFillMode: "forwards" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Equipo Rysteam
        </h2>
        <div className="flex flex-col gap-3">
          {[
            { nombre: "Eddy Marenco", rol: "Líder y Marketing" },
            { nombre: "Ronald Dávila", rol: "Comunicador" },
            { nombre: "Sharis Peralta", rol: "Diseño" },
            { nombre: "Dirk Martinez", rol: "Backend" },
            { nombre: "Sidar Perez", rol: "Frontend y Modo Historia" },
          ].map((miembro) => (
            <div key={miembro.nombre} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ backgroundColor: avatarBg, color: avatarTexto }}
              >
                {miembro.nombre[0]}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{miembro.nombre}</p>
                <p className="text-xs" style={{ color: textoSecundario }}>{miembro.rol}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: textoSecundario }}>
          Hecho con ❤️ en Nicaragua · Hackathon Nicaragua 2026
        </p>
      </div>

      {/* Política de privacidad */}
      <div
        className="extras-card rounded-2xl p-6"
        style={{ ...cardStyle, animation: "extras-entrar 400ms ease 240ms forwards", opacity: 0, animationFillMode: "forwards" }}
      >
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Política de privacidad
        </h2>
        <div className="flex flex-col gap-3 text-sm" style={{ color: textoSecundario }}>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Datos que recopilamos:</span>{" "}
            nombre para mostrar, código de acceso y progreso académico dentro de la plataforma.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Lo que NO recopilamos:</span>{" "}
            datos personales sensibles de menores, correo electrónico de estudiantes, ni información financiera.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Uso de datos:</span>{" "}
            los datos se utilizan exclusivamente para mostrar el progreso del estudiante y permitir que el docente acompañe el aprendizaje. No se venden ni comparten con terceros.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Alineado con:</span>{" "}
            Ley N° 787 de Protección de Datos Personales de Nicaragua.
          </p>
        </div>
        <p className="text-xs mt-4" style={{ color: textoSecundario }}>
          Consultas: contacto@dignalearn.com
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs mt-6" style={{ color: textoSecundario }}>
        © 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026
      </p>
    </div>
  );
}
