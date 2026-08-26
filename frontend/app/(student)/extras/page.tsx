"use client";

import { useState, useEffect } from "react";

export default function ExtrasPage() {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("dignalearn_tema");
    setModoOscuro(guardado === "dark");
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

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#160B24" }}>
        Extras
      </h1>

      {/* Configuración */}
      <div className="rounded-2xl border border-gray-100 bg-white dark:bg-white/5 dark:border-white/10 p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Configuración
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Modo oscuro
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
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
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Acerca de DignaLearn
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Plataforma educativa gamificada para la asignatura &quot;Derechos y Dignidad de la Mujer&quot; del MINED Nicaragua. Fortalecemos el proceso de enseñanza-aprendizaje mediante herramientas tecnológicas que permiten al estudiante y al docente comprender la asignatura.
        </p>
        <p className="text-xs text-gray-400">
          Contenido educativo basado en documentos oficiales del MINED Nicaragua.
        </p>
      </div>

      {/* Equipo */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
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
                style={{ backgroundColor: "#F0A8B620", color: "#160B24" }}
              >
                {miembro.nombre[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{miembro.nombre}</p>
                <p className="text-xs text-gray-400">{miembro.rol}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Hecho con ❤️ en Nicaragua · Hackathon Nicaragua 2026
        </p>
      </div>

      {/* Política de privacidad */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Política de privacidad
        </h2>
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-900">Datos que recopilamos:</span>{" "}
            nombre para mostrar, código de acceso y progreso académico dentro de la plataforma.
          </p>
          <p>
            <span className="font-medium text-gray-900">Lo que NO recopilamos:</span>{" "}
            datos personales sensibles de menores, correo electrónico de estudiantes, ni información financiera.
          </p>
          <p>
            <span className="font-medium text-gray-900">Uso de datos:</span>{" "}
            los datos se utilizan exclusivamente para mostrar el progreso del estudiante y permitir que el docente acompañe el aprendizaje. No se venden ni comparten con terceros.
          </p>
          <p>
            <span className="font-medium text-gray-900">Alineado con:</span>{" "}
            Ley N° 787 de Protección de Datos Personales de Nicaragua.
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Consultas: contacto@dignalearn.com
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026
      </p>
    </div>
  );
}
