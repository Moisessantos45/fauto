// Interfaces TypeScript

interface Punto {
  x: number;
  y: number;
}

interface Transicion {
  id: string;
  simboloLee: string;
  simboloEscribe: string;
  movimiento: 'L' | 'R' | 'S'; // Izquierda, Derecha, Se queda (Stay)
  proximoEstado: number; // ID del próximo estado (nodo)
}

interface Nodo {
  id: number;
  label: string;
  x: number;
  y: number;
  elemento?: HTMLElement;
  // Propiedades de máquina de Turing
  esInicial: boolean;
  esFinal: boolean;
  transiciones: Transicion[];
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

export type { Punto, Nodo, Conexion, PuntoControlMovimiento, Transicion };
