import type { Transicion } from "./nodo";

interface PasoSimulacion {
  paso: number;
  estadoActual: number;
  cinta: string[];
  posicionCabeza: number;
  simboloLeido: string;
  transicion: Transicion | null;
  mensaje: string;
}


export type { PasoSimulacion };