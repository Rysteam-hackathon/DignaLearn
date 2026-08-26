"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginEstudiante, loginDocente } from "@/lib/auth";

type Tab = "estudiante" | "docente";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("estudiante");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function selectTab(nuevaTab: Tab) {
    setTab(nuevaTab);
    setError(null);
  }

  async function handleSubmitEstudiante(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginEstudiante(codigo, pin);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitDocente(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginDocente(email, password);
      router.push("/docente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#160B24" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Digna<span style={{ color: "#A4CDD5" }}>Learn</span>
          </h1>
          <p className="text-sm" style={{ color: "#F0A8B6" }}>
            Educación que empodera. Dignidad que transforma.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-100">
            <button
              type="button"
              onClick={() => selectTab("estudiante")}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: tab === "estudiante" ? "#160B24" : "transparent",
                color: tab === "estudiante" ? "#ffffff" : "#9CA3AF",
              }}
            >
              Soy estudiante
            </button>
            <button
              type="button"
              onClick={() => selectTab("docente")}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: tab === "docente" ? "#160B24" : "transparent",
                color: tab === "docente" ? "#ffffff" : "#9CA3AF",
              }}
            >
              Soy docente
            </button>
          </div>

          {tab === "estudiante" ? (
            <form onSubmit={handleSubmitEstudiante} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#160B24]" htmlFor="codigo">
                  Código de acceso
                </label>
                <input
                  id="codigo"
                  type="text"
                  placeholder="DL-XXXX"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#A4CDD5] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#160B24]" htmlFor="pin">
                  PIN (4 dígitos)
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#A4CDD5] transition-colors"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl py-3 text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-90 mt-1"
                style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitDocente} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#160B24]" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#A4CDD5] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#160B24]" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#A4CDD5] transition-colors"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl py-3 text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-90 mt-1"
                style={{ backgroundColor: "#160B24", color: "#ffffff" }}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2026 DignaLearn — Equipo Rysteam
        </p>
      </div>
    </div>
  );
}
