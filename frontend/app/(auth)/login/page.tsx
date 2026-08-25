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
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-6">DignaLearn</h1>

      <div className="flex mb-6 rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => selectTab("estudiante")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === "estudiante" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
        >
          Soy estudiante
        </button>
        <button
          type="button"
          onClick={() => selectTab("docente")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === "docente" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
        >
          Soy docente
        </button>
      </div>

      {tab === "estudiante" ? (
        <form onSubmit={handleSubmitEstudiante} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="codigo">
              Código de acceso
            </label>
            <input
              id="codigo"
              type="text"
              placeholder="DL-XXXX"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="pin">
              PIN (4 dígitos)
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 text-white py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitDocente} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 text-white py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      )}
    </div>
  );
}
