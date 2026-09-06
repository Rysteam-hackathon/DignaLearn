-- ============================================================
-- DignaLearn — Migración 005
-- Cierra el acceso abierto ("cualquier autenticado puede leer")
-- que dejó la migración 004 en instituciones y grupos.
--
-- docente_grupos y perfiles_admin_institucion ya quedaron
-- correctamente acotadas por auth.uid() desde la 004 — no se tocan.
--
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- instituciones: reemplaza "auth puede leer instituciones"
DROP POLICY "auth puede leer instituciones" ON instituciones;

CREATE POLICY "docente lee su propia institucion"
ON instituciones FOR SELECT TO authenticated
USING (
  id IN (
    SELECT institucion_id FROM perfiles_docente WHERE usuario_id = auth.uid()
  )
);

-- grupos: reemplaza "auth puede leer grupos"
DROP POLICY "auth puede leer grupos" ON grupos;

CREATE POLICY "docente lee sus grupos"
ON grupos FOR SELECT TO authenticated
USING (
  id IN (
    SELECT dg.grupo_id
    FROM docente_grupos dg
    JOIN perfiles_docente pd ON pd.id = dg.docente_id
    WHERE pd.usuario_id = auth.uid()
  )
);
