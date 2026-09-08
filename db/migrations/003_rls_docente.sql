-- ============================================================
-- DignaLearn — Migración 003
-- RLS para tablas del panel del docente.
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

CREATE POLICY "docente lee su perfil"
    ON perfiles_docente FOR SELECT TO authenticated
    USING (usuario_id = auth.uid());

CREATE POLICY "docente ve sus vinculos"
    ON docente_estudiantes FOR SELECT TO authenticated
    USING (
        docente_id IN (
            SELECT id FROM perfiles_docente WHERE usuario_id = auth.uid()
        )
    );

CREATE POLICY "docente inserta vinculos"
    ON docente_estudiantes FOR INSERT TO authenticated
    WITH CHECK (
        docente_id IN (
            SELECT id FROM perfiles_docente WHERE usuario_id = auth.uid()
        )
    );

CREATE POLICY "docente lee perfiles de sus estudiantes"
    ON perfiles_estudiante FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT de.estudiante_id FROM docente_estudiantes de
            JOIN perfiles_docente pd ON pd.id = de.docente_id
            WHERE pd.usuario_id = auth.uid()
        )
    );

CREATE POLICY "docente crea perfiles estudiante"
    ON perfiles_estudiante FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "docente actualiza pin de sus estudiantes"
    ON perfiles_estudiante FOR UPDATE TO authenticated
    USING (
        id IN (
            SELECT de.estudiante_id FROM docente_estudiantes de
            JOIN perfiles_docente pd ON pd.id = de.docente_id
            WHERE pd.usuario_id = auth.uid()
        )
    );

CREATE POLICY "docente lee nombres de sus estudiantes"
    ON usuarios FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "docente crea usuarios para estudiantes"
    ON usuarios FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "docente lee progreso de sus estudiantes"
    ON progreso_estudiante FOR SELECT TO authenticated
    USING (
        estudiante_id IN (
            SELECT de.estudiante_id FROM docente_estudiantes de
            JOIN perfiles_docente pd ON pd.id = de.docente_id
            WHERE pd.usuario_id = auth.uid()
        )
    );
