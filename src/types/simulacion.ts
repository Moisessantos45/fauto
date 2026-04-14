import type { Transicion, TransicionDFA } from "./nodo";

// Paso de simulación para Máquina de Turing
interface PasoSimulacion {
  paso: number;
  estadoActual: number;
  cinta: string[];
  posicionCabeza: number;
  simboloLeido: string;
  transicion: Transicion | null;
  mensaje: string;
}

// Paso de simulación para DFA
interface PasoSimulacionDFA {
  paso: number;
  estadoActual: number;
  cadenaRestante: string;
  simboloLeido: string;
  transicion: TransicionDFA | null;
  mensaje: string;
}

export type { PasoSimulacion, PasoSimulacionDFA };