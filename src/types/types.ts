import type { Transicion } from "./nodo";

interface EstadoFormulario {
  nombre: string;
  esInicial: boolean;
  esFinal: boolean;
  transiciones: Transicion[];
}

export type { EstadoFormulario };
