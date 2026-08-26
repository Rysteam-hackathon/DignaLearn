"use client";

import { useEffect, useMemo, useState } from "react";
import { getEstudianteLocal } from "@/lib/auth";
import { marcarElementoCompletado, PROGRESO_ACTUALIZADO_EVENT } from "@/lib/progress";

interface WordSearchConfig {
  palabras: string[];
  pistas: string[];
  tamaño: number;
}

interface WordSearchProps {
  config: WordSearchConfig;
  temaId: string;
}

interface Cell {
  row: number;
  col: number;
}

const DIRECTIONS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

function generateGrid(
  palabras: string[],
  size: number
): { grid: string[][]; placements: Record<string, Cell[]> } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placements: Record<string, Cell[]> = {};
  const ordenadas = [...palabras].sort((a, b) => b.length - a.length);

  for (const palabra of ordenadas) {
    let colocada = false;
    let intentos = 0;

    while (!colocada && intentos < 300) {
      intentos++;
      const [dCol, dRow] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      const endRow = row + dRow * (palabra.length - 1);
      const endCol = col + dCol * (palabra.length - 1);

      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

      let cabe = true;
      for (let i = 0; i < palabra.length; i++) {
        const r = row + dRow * i;
        const c = col + dCol * i;
        const existente = grid[r][c];
        if (existente !== "" && existente !== palabra[i]) {
          cabe = false;
          break;
        }
      }
      if (!cabe) continue;

      const cells: Cell[] = [];
      for (let i = 0; i < palabra.length; i++) {
        const r = row + dRow * i;
        const c = col + dCol * i;
        grid[r][c] = palabra[i];
        cells.push({ row: r, col: c });
      }
      placements[palabra] = cells;
      colocada = true;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return { grid, placements };
}

function getLine(start: Cell, end: Cell): Cell[] | null {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  if (dRow === 0 && dCol === 0) return null;
  if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) return null;

  const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
  const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow);
  const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);

  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
  }
  return cells;
}

export default function WordSearch({ config, temaId }: WordSearchProps) {
  const { palabras, pistas, tamaño } = config;

  const { grid } = useMemo(
    () => generateGrid(palabras, tamaño),
    [palabras, tamaño]
  );

  const [selStart, setSelStart] = useState<Cell | null>(null);
  const [activeCells, setActiveCells] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Record<string, Cell[]>>({});
  const [progresoGuardado, setProgresoGuardado] = useState(false);

  const foundCellsSet = useMemo(() => {
    const set = new Set<string>();
    Object.values(foundCells).forEach((cells) =>
      cells.forEach((cell) => set.add(`${cell.row}-${cell.col}`))
    );
    return set;
  }, [foundCells]);

  const activeCellsSet = useMemo(
    () => new Set(activeCells.map((cell) => `${cell.row}-${cell.col}`)),
    [activeCells]
  );

  function handleCellClick(row: number, col: number) {
    const clicked = { row, col };

    if (!selStart) {
      setSelStart(clicked);
      setActiveCells([clicked]);
      return;
    }

    const line = getLine(selStart, clicked);
    setSelStart(null);

    if (!line) {
      setActiveCells([]);
      return;
    }

    const palabra = line.map((cell) => grid[cell.row][cell.col]).join("");
    const palabraInvertida = palabra.split("").reverse().join("");
    const encontrada = palabras.find(
      (p) => (p === palabra || p === palabraInvertida) && !foundWords.includes(p)
    );

    if (encontrada) {
      setFoundWords((prev) => [...prev, encontrada]);
      setFoundCells((prev) => ({ ...prev, [encontrada]: line }));
      setActiveCells([]);
    } else {
      setActiveCells(line);
      setTimeout(() => setActiveCells([]), 400);
    }
  }

  function cellClass(row: number, col: number): string {
    const key = `${row}-${col}`;
    if (foundCellsSet.has(key)) return "bg-[#A4CDD5] border-transparent";
    if (activeCellsSet.has(key)) return "bg-[#F0A8B6] border-transparent";
    return "bg-white border-gray-200 hover:bg-[#160B24]/5";
  }

  const completado = foundWords.length === palabras.length;

  useEffect(() => {
    if (!completado || progresoGuardado) return;

    const estudiante = getEstudianteLocal();
    if (!estudiante) return;

    setProgresoGuardado(true);
    marcarElementoCompletado(estudiante.id, temaId, "actividad")
      .then(() => {
        window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));
      })
      .catch(() => {
        // no bloqueamos la UI si falla el guardado de progreso
      });
  }, [completado, progresoGuardado, temaId]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div
        className="grid gap-1 select-none w-fit"
        style={{ gridTemplateColumns: `repeat(${tamaño}, minmax(0, 1fr))` }}
      >
        {grid.map((rowArr, r) =>
          rowArr.map((letra, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => handleCellClick(r, c)}
              className={`w-8 h-8 flex items-center justify-center text-sm font-semibold text-[#160B24] border rounded transition-colors ${cellClass(
                r,
                c
              )}`}
            >
              {letra}
            </button>
          ))
        )}
      </div>

      <div className="flex-1 min-w-[220px]">
        <p className="text-sm text-gray-500 mb-2">
          {foundWords.length} de {palabras.length} palabras encontradas
        </p>
        <ul className="space-y-1 mb-4">
          {palabras.map((palabra, i) => {
            const encontrada = foundWords.includes(palabra);
            return (
              <li
                key={palabra}
                className={`text-sm ${
                  encontrada ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {pistas[i] ?? palabra}
              </li>
            );
          })}
        </ul>
        {completado && (
          <p className="text-sm font-semibold text-emerald-600">
            ¡Completaste la sopa de letras!
          </p>
        )}
      </div>
    </div>
  );
}
