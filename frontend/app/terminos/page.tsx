"use client";
import PaginaLegal, { SeccionLegal } from "@/components/ui/PaginaLegal";

const ELEMENTOS = [
  { simbolo:"★",  top:"10%",   right:"6%",  color:"#F0A8B6", size:"5.5rem",duracion:4,   animacion:{ y:[0,-18,0], rotate:[0,10,0] } },
  { simbolo:"📖", top:"8%",    left:"4%",   color:"#A4CDD5", size:"5rem",  duracion:5.5, animacion:{ y:[0,-14,0] } },
  { simbolo:"♀",  bottom:"10%",right:"3%",  color:"#F0A8B6", size:"7rem",  duracion:6,   animacion:{ y:[0,-22,0] } },
  { simbolo:"⚖",  bottom:"18%",left:"5%",   color:"#A4CDD5", size:"4.5rem",duracion:5,   animacion:{ y:[0,-12,0] } },
  { simbolo:"♀",  top:"45%",   right:"12%", color:"#F0A8B6", size:"4rem",  duracion:7,   animacion:{ y:[0,-10,0], scale:[1,1.08,1] } },
  { simbolo:"✏",  top:"50%",   left:"2%",   color:"#A4CDD5", size:"3.5rem",duracion:4.5, animacion:{ y:[0,-8,0], rotate:[0,-12,0] } },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      badge="📄 Documento legal"
      titulo="Términos de Uso"
      subtitulo="Vigente desde el 1 de septiembre de 2026 · DignaLearn — Equipo Rysteam"
      elementos={ELEMENTOS}
    >
      <SeccionLegal titulo="Propósito de la plataforma" color="#F0A8B6">
        <p>DignaLearn es una página web educativa gamificada desarrollada
        por el Equipo Rysteam para el Hackathon Nicaragua 2026. Su objetivo
        es fortalecer el proceso de enseñanza-aprendizaje de la asignatura
        oficial del MINED &quot;Derechos y Dignidad de la Mujer&quot; mediante
        actividades interactivas, lectura adaptada y narrativa visual.</p>
        <p className="mt-2">Todo el contenido curricular está basado en
        documentos oficiales del Ministerio de Educación de Nicaragua (MINED).
        DignaLearn complementa la metodología docente — no la reemplaza.</p>
      </SeccionLegal>

      <SeccionLegal titulo="Roles y responsabilidades" color="#A4CDD5">
        <p className="font-semibold text-white/80">ESTUDIANTES</p>
        <ul className="list-none space-y-1 mt-1 mb-4">
          <li>• Usar la plataforma únicamente con fines educativos</li>
          <li>• Mantener la confidencialidad de su código de acceso y PIN</li>
          <li>• No compartir su cuenta con otras personas</li>
          <li>• No intentar acceder a cuentas o datos de otros estudiantes</li>
        </ul>
        <p className="font-semibold text-white/80">DOCENTES</p>
        <ul className="list-none space-y-1 mt-1">
          <li>• Crear cuentas de estudiantes responsablemente</li>
          <li>• Entregar los códigos de acceso de forma segura y presencial</li>
          <li>• Reportar cualquier uso inapropiado de la plataforma</li>
          <li>• Gestionar el PIN de los estudiantes bajo su responsabilidad</li>
        </ul>
      </SeccionLegal>

      <SeccionLegal titulo="Uso aceptable" color="#F0A8B6">
        <p>Está prohibido:</p>
        <ul className="list-none space-y-1 mt-2">
          <li>• Usar la plataforma para fines distintos al educativo</li>
          <li>• Intentar vulnerar la seguridad del sistema</li>
          <li>• Publicar, compartir o reproducir el contenido curricular
              sin autorización del MINED Nicaragua</li>
          <li>• Crear cuentas falsas o suplantar identidades</li>
        </ul>
        <p className="mt-3">DignaLearn se reserva el derecho de suspender
        cuentas que violen estos términos, previa notificación al docente
        a cargo.</p>
      </SeccionLegal>

      <SeccionLegal titulo="Contenido y propiedad intelectual" color="#A4CDD5">
        <p>El contenido educativo de DignaLearn es una adaptación original
        del material oficial del MINED Nicaragua. Está prohibida su
        reproducción total o parcial sin autorización expresa.</p>
        <p className="mt-2">Los elementos de diseño, marca, logo e identidad
        visual de DignaLearn son propiedad del Equipo Rysteam © 2026.</p>
      </SeccionLegal>

      <SeccionLegal titulo="Limitación de responsabilidad" color="#F0A8B6">
        <p>DignaLearn es una herramienta de apoyo educativo. No garantizamos
        resultados académicos específicos. La plataforma se provee &quot;tal como
        está&quot; durante el período del Hackathon Nicaragua 2026 y su continuidad
        depende del desarrollo posterior del proyecto.</p>
        <p className="mt-2">No somos responsables por el uso inapropiado de
        la plataforma ni por interrupciones del servicio fuera de nuestro
        control.</p>
      </SeccionLegal>

      <SeccionLegal titulo="Contacto" color="#A4CDD5">
        <p>¿Preguntas sobre estos términos? Escribinos a:{" "}
          <a href="mailto:dignalearnRS@gmail.com"
             className="text-[#A4CDD5] hover:underline">
            dignalearnRS@gmail.com
          </a>
        </p>
      </SeccionLegal>
    </PaginaLegal>
  );
}
