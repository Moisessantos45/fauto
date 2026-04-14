// Interfaces TypeScript

// Tipo de autómata soportado
type TipoAutomata = "tm" | "dfa" | "nfa";

interface Punto {
  x: number;
  y: number;
}

// Transición para Máquina de Turing
interface Transicion {
  id: string;
  simboloLee: string;
  simboloEscribe: string;
  movimiento: "L" | "R" | "S"; // Izquierda, Derecha, Se queda (Stay)
  proximoEstado: number; // ID del próximo estado (nodo)
}

// Transición para DFA (simplificada)
interface TransicionDFA {
  id: string;
  simbolo: string; // Símbolo de entrada
  proximoEstado: number; // ID del próximo estado (nodo)
}

// Tipo unión para transiciones
type TransicionUnificada = Transicion | TransicionDFA;

interface Nodo {
  id: number;
  label: string;
  x: number;
  y: number;
  elemento?: HTMLElement;
  // Propiedades de máquina de Turing / DFA / NFA
  esInicial: boolean;
  esFinal: boolean;
  transiciones: Transicion[]; // Para TM
  transicionesDFA?: TransicionDFA[]; // Para DFA (opcional)
  transicionesNFA?: TransicionNFA[]; // Para NFA (opcional)
}

interface Conexion {
  origen: HTMLElement;
  destino: HTMLElement;
  controlPoints: Punto[];
}

interface PuntoControlMovimiento {
  circulo: SVGCircleElement;
  connectionId: string;
  puntoIndex: number;
}

// Constante para transiciones epsilon
const EPSILON = "ε";

// Transición para NFA (igual que DFA pero permite múltiples y epsilon)
interface TransicionNFA {
  id: string;
  simbolo: string; // Puede ser 'ε' para epsilon
  proximoEstado: number;
}

export { EPSILON };
export type {
  Punto,
  Nodo,
  Conexion,
  PuntoControlMovimiento,
  Transicion,
  TransicionDFA,
  TransicionUnificada,
  TipoAutomata,
  TransicionNFA,
};
