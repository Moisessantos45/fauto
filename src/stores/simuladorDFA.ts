import { ref } from "vue";
import { defineStore } from "pinia";
import useNodosStore from "./nodos";
import type { TransicionDFA } from "@/types/nodo";
import type { PasoSimulacionDFA } from "@/types/simulacion";

export const useSimuladorDFAStore = defineStore("simuladorDFA", () => {
  const nodosStore = useNodosStore();

  const enSimulacion = ref(false);
  const pausado = ref(false);
  const cadenaEntrada = ref<string>("");
  const posicionLectura = ref(0);
  const estadoActual = ref<number | null>(null);
  const historialPasos = ref<PasoSimulacionDFA[]>([]);
  const pasoActual = ref(0);

  const velocidadSimulacion = ref(500);
  const simulacionAutomaticaActiva = ref(false);

  const iniciarSimulacion = (entrada: string): boolean => {
    const estadoInicial = nodosStore.obtenerEstadoInicial();
    if (!estadoInicial) {
      console.error("No hay un estado inicial definido");
      return false;
    }

    cadenaEntrada.value = entrada;
    posicionLectura.value = 0;
    estadoActual.value = estadoInicial.id;
    historialPasos.value = [];
    pasoActual.value = 0;
    enSimulacion.value = true;
    pausado.value = false;

    registrarPaso(0, estadoInicial.id, null, "Simulación DFA iniciada");

    return true;
  };

  const registrarPaso = (
    paso: number,
    estado: number,
    transicion: TransicionDFA | null,
    mensaje: string
  ) => {
    historialPasos.value.push({
      paso,
      estadoActual: estado,
      cadenaRestante: cadenaEntrada.value.slice(posicionLectura.value),
      simboloLeido: cadenaEntrada.value[posicionLectura.value] || "",
      transicion,
      mensaje,
    });
  };

  const obtenerTransicionDFA = (
    nodoId: number,
    simbolo: string
  ): TransicionDFA | undefined => {
    const nodo = nodosStore.nodos.find((n) => n.id === nodoId);
    if (!nodo || !nodo.transicionesDFA) return undefined;

    return nodo.transicionesDFA.find((t) => t.simbolo === simbolo);
  };

  const ejecutarPaso = (): boolean => {
    if (!enSimulacion.value || estadoActual.value === null) {
      return false;
    }

    pasoActual.value++;

    const nodoActual = nodosStore.nodos.find(
      (n) => n.id === estadoActual.value
    );
    if (!nodoActual) {
      registrarPaso(
        pasoActual.value,
        estadoActual.value,
        null,
        "Estado no encontrado"
      );
      return false;
    }

    // Si ya no hay más símbolos que leer
    if (posicionLectura.value >= cadenaEntrada.value.length) {
      if (nodoActual.esFinal) {
        registrarPaso(
          pasoActual.value,
          estadoActual.value,
          null,
          `Cadena aceptada. Estado final: ${nodoActual.label}`
        );
      } else {
        registrarPaso(
          pasoActual.value,
          estadoActual.value,
          null,
          `Cadena rechazada. Estado ${nodoActual.label} no es final`
        );
      }
      finalizarSimulacion();
      return true;
    }

    const simboloActual = cadenaEntrada.value[posicionLectura.value];
    if (!simboloActual) {
      registrarPaso(
        pasoActual.value,
        estadoActual.value,
        null,
        "Símbolo no encontrado"
      );
      return false;
    }

    console.log(
      `[DFA] Estado: ${nodoActual.label}, Símbolo: '${simboloActual}', Posición: ${posicionLectura.value}`
    );

    const transicion = obtenerTransicionDFA(estadoActual.value, simboloActual);

    if (!transicion) {
      registrarPaso(
        pasoActual.value,
        estadoActual.value,
        null,
        `No hay transición para '${simboloActual}' en estado ${nodoActual.label}`
      );
      finalizarSimulacion();
      return false;
    }

    // Avanzar en la cadena
    posicionLectura.value++;

    // Cambiar al siguiente estado
    const nuevoEstado = transicion.proximoEstado;
    estadoActual.value = nuevoEstado;

    registrarPaso(
      pasoActual.value,
      estadoActual.value,
      transicion,
      `Transición: '${simboloActual}' → Estado ${
        nodosStore.nodos.find((n) => n.id === nuevoEstado)?.label || nuevoEstado
      }`
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
    estadoActual.value = null;
    historialPasos.value = [];
    pasoActual.value = 0;
  };

  const finalizarSimulacion = () => {
    enSimulacion.value = false;
    simulacionAutomaticaActiva.value = false;
    pausado.value = false;
  };

  const obtenerEstadoSimulacion = () => {
    const nodoActual = nodosStore.nodos.find(
      (n) => n.id === estadoActual.value
    );

    return {
      enSimulacion: enSimulacion.value,
      pausado: pausado.value,
      pasoActual: pasoActual.value,
      estadoActual: nodoActual?.label || "N/A",
      estadoActualId: estadoActual.value,
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

    // Validar transiciones DFA
    nodosStore.nodos.forEach((nodo) => {
      if (nodo.transicionesDFA) {
        nodo.transicionesDFA.forEach((trans) => {
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
    estadoActual,
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
    obtenerTransicionDFA,
  };
});
