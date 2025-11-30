import { ref } from "vue";
import { defineStore } from "pinia";
import useNodosStore from "./nodos";
import type { Transicion } from "@/types/nodo";
import type { PasoSimulacion } from "@/types/simulacion";

export const useSimuladorStore = defineStore("simulador", () => {
  const nodosStore = useNodosStore();

  const enSimulacion = ref(false);
  const pausado = ref(false);
  const cinta = ref<string[]>([]);
  const posicionCabeza = ref(0);
  const estadoActual = ref<number | null>(null);
  const historialPasos = ref<PasoSimulacion[]>([]);
  const simboloBlanco = ref("_");
  const pasoActual = ref(0);

  const velocidadSimulacion = ref(500);
  const simulacionAutomaticaActiva = ref(false);

  const iniciarSimulacion = (entrada: string): boolean => {
    const estadoInicial = nodosStore.obtenerEstadoInicial();
    if (!estadoInicial) {
      console.error("No hay un estado inicial definido");
      return false;
    }

    cinta.value =
      entrada.split("").length > 0 ? entrada.split("") : [simboloBlanco.value];
    posicionCabeza.value = 0;
    estadoActual.value = estadoInicial.id;
    historialPasos.value = [];
    pasoActual.value = 0;
    enSimulacion.value = true;
    pausado.value = false;
    registrarPaso(0, estadoInicial.id, null, "Simulación iniciada");

    return true;
  };

  const registrarPaso = (
    paso: number,
    estado: number,
    transicion: Transicion | null,
    mensaje: string
  ) => {
    historialPasos.value.push({
      paso,
      estadoActual: estado,
      cinta: [...cinta.value],
      posicionCabeza: posicionCabeza.value,
      simboloLeido: cinta.value[posicionCabeza.value] || simboloBlanco.value,
      transicion,
      mensaje,
    });
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

    if (nodoActual.esFinal) {
      registrarPaso(
        pasoActual.value,
        estadoActual.value,
        null,
        `Máquina aceptada. Estado final: ${nodoActual.label}`
      );
      finalizarSimulacion();
      return true;
    }

    if (posicionCabeza.value < 0) {
      cinta.value.unshift(simboloBlanco.value);
      posicionCabeza.value = 0;
    }

    if (posicionCabeza.value >= cinta.value.length) {
      cinta.value.push(simboloBlanco.value);
    }

    const simboloActual =
      cinta.value[posicionCabeza.value] || simboloBlanco.value;

    console.log(
      `[Simulador] Estado: ${
        nodoActual.label
      }, Símbolo: '${simboloActual}' (código: ${simboloActual.charCodeAt(
        0
      )}), Posición: ${posicionCabeza.value}`
    );
    console.log(
      `[Simulador] Transiciones disponibles:`,
      nodoActual.transiciones.map(
        (t) =>
          `'${t.simboloLee}' (código: ${t.simboloLee.charCodeAt(0)}) → estado ${
            t.proximoEstado
          }`
      )
    );

    const transicion = nodosStore.obtenerTransicion(
      estadoActual.value,
      simboloActual
    );

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

    cinta.value[posicionCabeza.value] = transicion.simboloEscribe;

    if (transicion.movimiento === "L") {
      posicionCabeza.value--;
    } else if (transicion.movimiento === "R") {
      posicionCabeza.value++;
    }

    const nuevoEstado = transicion.proximoEstado;
    estadoActual.value = nuevoEstado;

    registrarPaso(
      pasoActual.value,
      estadoActual.value,
      transicion,
      `Transición: ${simboloActual} → ${transicion.simboloEscribe}, movimiento: ${transicion.movimiento}`
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
    cinta.value = [];
    posicionCabeza.value = 0;
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
      cinta: cinta.value,
      posicionCabeza: posicionCabeza.value,
      historialPasos: historialPasos.value,
      ultimoPaso: historialPasos.value[historialPasos.value.length - 1],
    };
  };

  const obtenerCintaFormateada = (): string => {
    return cinta.value.join("");
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

    nodosStore.nodos.forEach((nodo) => {
      nodo.transiciones.forEach((trans) => {
        if (!nodosStore.nodos.find((n) => n.id === trans.proximoEstado)) {
          errores.push(
            `Transición en "${nodo.label}" apunta a estado inválido`
          );
        }
      });
    });

    return {
      valida: errores.length === 0,
      errores,
    };
  };

  return {
    enSimulacion,
    pausado,
    cinta,
    posicionCabeza,
    estadoActual,
    historialPasos,
    simboloBlanco,
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
    obtenerCintaFormateada,
    validarConfiguracion,
  };
});
