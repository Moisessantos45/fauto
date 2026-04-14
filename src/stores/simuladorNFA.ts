import { ref } from "vue";
import { defineStore } from "pinia";
import useNodosStore from "./nodos";
import type { TransicionNFA } from "@/types/nodo";
import { EPSILON } from "@/types/nodo";

interface PasoSimulacionNFA {
  paso: number;
  estadosActuales: number[];
  cadenaRestante: string;
  simboloLeido: string;
  mensaje: string;
}

export const useSimuladorNFAStore = defineStore("simuladorNFA", () => {
  const nodosStore = useNodosStore();

  const enSimulacion = ref(false);
  const pausado = ref(false);
  const cadenaEntrada = ref<string>("");
  const posicionLectura = ref(0);
  const estadosActuales = ref<Set<number>>(new Set());
  const historialPasos = ref<PasoSimulacionNFA[]>([]);
  const pasoActual = ref(0);

  const velocidadSimulacion = ref(500);
  const simulacionAutomaticaActiva = ref(false);


  const calcularCerraduraEpsilon = (estados: Set<number>): Set<number> => {
    const cerradura = new Set(estados);
    const pila = Array.from(estados);

    while (pila.length > 0) {
      const estado = pila.pop()!;
      const nodo = nodosStore.nodos.find((n) => n.id === estado);

      if (nodo?.transicionesNFA) {
        nodo.transicionesNFA
          .filter((t) => t.simbolo === EPSILON)
          .forEach((t) => {
            if (!cerradura.has(t.proximoEstado)) {
              cerradura.add(t.proximoEstado);
              pila.push(t.proximoEstado);
            }
          });
      }
    }

    return cerradura;
  };

  const iniciarSimulacion = (entrada: string): boolean => {
    const estadoInicial = nodosStore.obtenerEstadoInicial();
    if (!estadoInicial) {
      console.error("No hay un estado inicial definido");
      return false;
    }

    cadenaEntrada.value = entrada;
    posicionLectura.value = 0;


    const estadosIniciales = new Set([estadoInicial.id]);
    estadosActuales.value = calcularCerraduraEpsilon(estadosIniciales);

    historialPasos.value = [];
    pasoActual.value = 0;
    enSimulacion.value = true;
    pausado.value = false;

    registrarPaso(0, "Simulación NFA iniciada");

    return true;
  };

  const registrarPaso = (paso: number, mensaje: string) => {
    historialPasos.value.push({
      paso,
      estadosActuales: Array.from(estadosActuales.value),
      cadenaRestante: cadenaEntrada.value.slice(posicionLectura.value),
      simboloLeido: cadenaEntrada.value[posicionLectura.value] || "",
      mensaje,
    });
  };

  const obtenerTransicionesNFA = (
    nodoId: number,
    simbolo: string
  ): TransicionNFA[] => {
    const nodo = nodosStore.nodos.find((n) => n.id === nodoId);
    if (!nodo || !nodo.transicionesNFA) return [];

    return nodo.transicionesNFA.filter((t) => t.simbolo === simbolo);
  };

  const ejecutarPaso = (): boolean => {
    if (!enSimulacion.value || estadosActuales.value.size === 0) {
      return false;
    }

    pasoActual.value++;

    // Si ya no hay más símbolos que leer, verificar aceptación
    if (posicionLectura.value >= cadenaEntrada.value.length) {
      // Verificar si algún estado actual es final
      const algunEstadoFinal = Array.from(estadosActuales.value).some(
        (estadoId) => {
          const nodo = nodosStore.nodos.find((n) => n.id === estadoId);
          return nodo?.esFinal;
        }
      );

      if (algunEstadoFinal) {
        registrarPaso(
          pasoActual.value,
          "Cadena aceptada. Al menos un estado es final."
        );
      } else {
        registrarPaso(
          pasoActual.value,
          "Cadena rechazada. Ningún estado activo es final."
        );
      }
      finalizarSimulacion();
      return true;
    }

    const simboloActual = cadenaEntrada.value[posicionLectura.value];
    if (simboloActual === undefined) {
      finalizarSimulacion();
      return false;
    }

    const nuevosEstados = new Set<number>();

    // Para cada estado actual, obtener todas las transiciones posibles
    estadosActuales.value.forEach((estadoId) => {
      const transiciones = obtenerTransicionesNFA(estadoId, simboloActual);
      transiciones.forEach((t) => {
        nuevosEstados.add(t.proximoEstado);
      });
    });


    if (nuevosEstados.size === 0) {
      registrarPaso(
        pasoActual.value,
        `No hay transiciones para '${simboloActual}' desde los estados actuales`
      );
      finalizarSimulacion();
      return false;
    }


    posicionLectura.value++;


    estadosActuales.value = calcularCerraduraEpsilon(nuevosEstados);

    const estadosLabels = Array.from(estadosActuales.value)
      .map((id) => nodosStore.nodos.find((n) => n.id === id)?.label || id)
      .join(", ");

    registrarPaso(
      pasoActual.value,
      `Transición: '${simboloActual}' → Estados: {${estadosLabels}}`
    );

    return true;
  };

  const simularCompleto = async () => {
    simulacionAutomaticaActiva.value = true;
    let maxPasos = 10000;

    while (enSimulacion.value && maxPasos > 0) {
      if (!pausado.value) {
        ejecutarPaso();
        maxPasos--;

        await new Promise((resolve) =>
          setTimeout(resolve, velocidadSimulacion.value)
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    simulacionAutomaticaActiva.value = false;
  };

  const togglePausa = () => {
    if (enSimulacion.value) {
      pausado.value = !pausado.value;
    }
  };

  const reiniciar = () => {
    enSimulacion.value = false;
    pausado.value = false;
    simulacionAutomaticaActiva.value = false;
    cadenaEntrada.value = "";
    posicionLectura.value = 0;
    estadosActuales.value = new Set();
    historialPasos.value = [];
    pasoActual.value = 0;
  };

  const finalizarSimulacion = () => {
    enSimulacion.value = false;
    simulacionAutomaticaActiva.value = false;
    pausado.value = false;
  };

  const obtenerEstadoSimulacion = () => {
    return {
      enSimulacion: enSimulacion.value,
      pausado: pausado.value,
      pasoActual: pasoActual.value,
      estadosActuales: Array.from(estadosActuales.value),
      cadenaRestante: cadenaEntrada.value.slice(posicionLectura.value),
      posicionLectura: posicionLectura.value,
      historialPasos: historialPasos.value,
      ultimoPaso: historialPasos.value[historialPasos.value.length - 1],
    };
  };

  const validarConfiguracion = (): { valida: boolean; errores: string[] } => {
    const errores: string[] = [];

    if (nodosStore.nodos.length === 0) {
      errores.push("No hay estados definidos");
    }

    if (!nodosStore.obtenerEstadoInicial()) {
      errores.push("No hay un estado inicial");
    }

    if (!nodosStore.nodos.some((n) => n.esFinal)) {
      errores.push("No hay un estado final");
    }

    // Validar transiciones NFA
    nodosStore.nodos.forEach((nodo) => {
      if (nodo.transicionesNFA) {
        nodo.transicionesNFA.forEach((trans) => {
          if (!nodosStore.nodos.find((n) => n.id === trans.proximoEstado)) {
            errores.push(
              `Transición en "${nodo.label}" apunta a estado inválido`
            );
          }
        });
      }
    });

    return {
      valida: errores.length === 0,
      errores,
    };
  };

  return {
    enSimulacion,
    pausado,
    cadenaEntrada,
    posicionLectura,
    estadosActuales,
    historialPasos,
    pasoActual,
    velocidadSimulacion,
    simulacionAutomaticaActiva,

    iniciarSimulacion,
    ejecutarPaso,
    simularCompleto,
    togglePausa,
    reiniciar,
    finalizarSimulacion,
    obtenerEstadoSimulacion,
    validarConfiguracion,
    calcularCerraduraEpsilon,
  };
});
