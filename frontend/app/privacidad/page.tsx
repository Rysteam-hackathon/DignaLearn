"use client";
import PaginaLegal, { SeccionLegal } from "@/components/ui/PaginaLegal";

const ELEMENTOS = [
  { simbolo:"♀", top:"8%",   left:"5%",   color:"#F0A8B6", size:"6rem",  duracion:5,   animacion:{ y:[0,-20,0] } },
  { simbolo:"⚖", top:"15%",  right:"8%",  color:"#A4CDD5", size:"5rem",  duracion:4,   animacion:{ y:[0,-15,0], rotate:[0,8,0] } },
  { simbolo:"★", top:"45%",  left:"3%",   color:"#A4CDD5", size:"4rem",  duracion:6,   animacion:{ y:[0,-12,0] } },
  { simbolo:"♥", top:"60%",  right:"5%",  color:"#F0A8B6", size:"4.5rem",duracion:5.5, animacion:{ y:[0,-18,0], scale:[1,1.1,1] } },
  { simbolo:"✏", bottom:"20%",left:"8%",  color:"#F0A8B6", size:"3.5rem",duracion:4.5, animacion:{ y:[0,-10,0], rotate:[0,15,0] } },
  { simbolo:"♀", bottom:"8%", right:"4%", color:"#A4CDD5", size:"7rem",  duracion:7,   animacion:{ y:[0,-25,0] } },
];

export default function PoliticaPrivacidadPage() {
  return (
    <PaginaLegal
      badge="📋 Documento legal"
      titulo="Política de Privacidad"
      subtitulo="Vigente desde el 1 de septiembre de 2026 · DignaLearn — Equipo Rysteam"
      elementos={ELEMENTOS}
    >
      <SeccionLegal titulo="¿Qué datos recopilamos?" color="#F0A8B6">
        <p>DignaLearn recopila únicamente los datos mínimos necesarios
        para brindarte una experiencia educativa personalizada y segura:</p>
        <ul className="list-none space-y-1 mt-2">
          <li>• Nombre de pila o alias del estudiante</li>
          <li>• Código de acceso institucional (formato DL-XXXX)</li>
          <li>• Progreso académico: temas completados, logros
              desbloqueados y racha de actividad</li>
          <li>• Grado asignado (7mo o 9no de secundaria)</li>
        </ul>
        <p className="mt-3">No recopilamos correo electrónico, fecha de
        nacimiento, número de teléfono ni ningún otro dato personal
        sensible de los estudiantes.</p>
      </SeccionLegal>

      <SeccionLegal titulo="¿Para qué usamos tus datos?" color="#A4CDD5">
        <p>Tus datos se usan exclusivamente para:</p>
        <ul className="list-none space-y-1 mt-2">
          <li>• Mostrarte tu progreso personal dentro de la plataforma</li>
          <li>• Permitir que tu docente monitoree el avance del grupo</li>
          <li>• Calcular logros, rachas y estadísticas de aprendizaje</li>
          <li>• Garantizar la seguridad de tu cuenta</li>
        </ul>
        <p className="mt-3">Nunca usamos tus datos con fines comerciales,
        publicitarios ni de ningún tipo ajeno al proceso educativo.</p>
      </SeccionLegal>

      <SeccionLegal titulo="¿Quién puede ver mis datos?" color="#F0A8B6">
        <ul className="list-none space-y-1">
          <li>• Tu docente asignado puede ver tu nombre, código de acceso,
              progreso por unidad y logros desbloqueados.</li>
          <li>• Ningún otro estudiante puede ver tu información.</li>
          <li>• El equipo de DignaLearn accede a datos agregados y anónimos
              únicamente para mejorar la plataforma.</li>
          <li>• No compartimos, vendemos ni cedemos tus datos a terceros.</li>
        </ul>
      </SeccionLegal>

      <SeccionLegal titulo="Protección de datos de menores" color="#A4CDD5">
        <p>DignaLearn está diseñado para estudiantes de secundaria de
        Nicaragua. Cumplimos con la Ley N° 787 de Protección de Datos
        Personales de Nicaragua.</p>
        <ul className="list-none space-y-1 mt-2">
          <li>• No solicitamos datos personales innecesarios a menores.</li>
          <li>• Las cuentas de estudiantes son creadas y gestionadas por
              docentes o personal autorizado de la institución educativa.</li>
          <li>• Los datos de progreso se almacenan en servidores seguros
              con cifrado en tránsito y en reposo.</li>
        </ul>
      </SeccionLegal>

      <SeccionLegal titulo="Tus derechos" color="#F0A8B6">
        <p>Tenés derecho a:</p>
        <ul className="list-none space-y-1 mt-2">
          <li>• Solicitar la eliminación de tu cuenta y datos asociados</li>
          <li>• Conocer qué información tenemos sobre vos</li>
          <li>• Corregir datos incorrectos a través de tu docente</li>
        </ul>
        <p className="mt-3">Para ejercer estos derechos, contactanos en:{" "}
          <a href="mailto:dignalearnRS@gmail.com"
             className="text-[#F0A8B6] hover:underline">
            dignalearnRS@gmail.com
          </a>
        </p>
      </SeccionLegal>

      <SeccionLegal titulo="Cambios a esta política" color="#A4CDD5">
        <p>Podemos actualizar esta política en cualquier momento. Los
        cambios significativos serán comunicados a través de la plataforma.
        La fecha de última actualización siempre estará visible al inicio
        de este documento.</p>
      </SeccionLegal>
    </PaginaLegal>
  );
}
