-- Habilitar RLS en las tablas nuevas del modelo institución/grupo
ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE docente_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles_admin_institucion ENABLE ROW LEVEL SECURITY;

-- instituciones: cualquier usuario autenticado puede leer
CREATE POLICY "auth puede leer instituciones"
ON instituciones FOR SELECT
TO authenticated
USING (true);

-- grupos: cualquier usuario autenticado puede leer
CREATE POLICY "auth puede leer grupos"
ON grupos FOR SELECT
TO authenticated
USING (true);

-- docente_grupos: solo el docente dueño puede leer.
-- docente_grupos.docente_id es perfiles_docente.id, NO auth.uid() directamente
-- (perfiles_docente.usuario_id es el que sí es auth.uid()) — por eso el subquery.
CREATE POLICY "docente lee sus grupos"
ON docente_grupos FOR SELECT
TO authenticated
USING (
  docente_id IN (
    SELECT id FROM perfiles_docente WHERE usuario_id = auth.uid()
  )
);

-- perfiles_admin_institucion: solo el admin dueño puede leer
CREATE POLICY "admin lee su perfil"
ON perfiles_admin_institucion FOR SELECT
TO authenticated
USING (auth.uid() = usuario_id);
