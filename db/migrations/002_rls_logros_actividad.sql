-- ============================================================
-- DignaLearn — Migración 002
-- Políticas RLS para estudiante_logros y actividad_diaria.
-- RLS ya está habilitado en ambas tablas — solo faltan las políticas.
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

CREATE POLICY "anon puede leer estudiante_logros"
    ON estudiante_logros FOR SELECT TO anon USING (true);

CREATE POLICY "anon puede leer actividad_diaria"
    ON actividad_diaria FOR SELECT TO anon USING (true);

CREATE POLICY "anon puede insertar actividad_diaria"
    ON actividad_diaria FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon puede actualizar actividad_diaria"
    ON actividad_diaria FOR UPDATE TO anon USING (true);

CREATE POLICY "anon puede insertar estudiante_logros"
    ON estudiante_logros FOR INSERT TO anon WITH CHECK (true);
