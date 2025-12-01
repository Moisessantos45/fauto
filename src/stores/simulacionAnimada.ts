import { defineStore } from "pinia";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";
import { storeToRefs } from "pinia";
import { useSimuladorStore } from "./simulador";
import useStateTransitionStore from "./stateTransition";

const useSimulationAnimatedStore = defineStore("simulacionAnimada", () => {
  const useModal = useModalStore();
  const simuladorStore = useSimuladorStore();
  const nodosStore = useNodosStore();
  const useStateTransition = useStateTransitionStore();

  const { conexiones } = storeToRefs(nodosStore);
  const {
    conexionActiva,
    velocidadAnimacion,
    estadosVisitados,
    entradaSimulacion,
  } = storeToRefs(useStateTransition);

  const animarTransicion = async (
    estadoOrigen: number,
    estadoDestino: number
  ) => {
    let conexionIdEncontrada: string | null = null;

    conexiones.value.forEach((conn, connId) => {
      const origenId = parseInt(
        conn.origen.getAttribute("data-nodo-id") || "-1"
      );
      const destinoId = parseInt(
        conn.destino.getAttribute("data-nodo-id") || "-1"
      );

      if (origenId === estadoOrigen && destinoId === estadoDestino) {
        conexionIdEncontrada = connId;
      }
    });

    conexionActiva.value = conexionIdEncontrada;

    if (conexionActiva.value) {
      const pathElement = document.getElementById(conexionActiva.value);
      if (pathElement) {
        pathElement.classList.add("conexion-activa");
      }
    }

    await new Promise((resolve) =>
      setTimeout(resolve, velocidadAnimacion.value / 2)
    );

    if (conexionActiva.value) {
      const pathElement = document.getElementById(conexionActiva.value);
      if (pathElement) {
        pathElement.classList.remove("conexion-activa");
      }
    }
    conexionActiva.value = null;
  };

  const iniciarSimulacionAnimada = async () => {
    const validacion = simuladorStore.validarConfiguracion();
    if (!validacion.valida) {
      useModal.openModal(
        "Configuración inválida",
        validacion.errores.join("\n")
      );
      return;
    }

    if (!entradaSimulacion.value.trim()) {
      useModal.openModal(
        "Error de entrada",
        "Por favor ingresa una cadena de entrada"
      );
      return;
    }

    // Debug: mostrar configuración de nodos
    console.log("=== INICIO SIMULACIÓN ===");
    console.log("Entrada:", entradaSimulacion.value);
    console.log(
      "Nodos:",
      nodosStore.nodos.map((n) => ({
        id: n.id,
        label: n.label,
        esInicial: n.esInicial,
        esFinal: n.esFinal,
        transiciones: n.transiciones.map((t) => ({
          lee: t.simboloLee,
          escribe: t.simboloEscribe,
          mov: t.movimiento,
          proximo: t.proximoEstado,
        })),
      }))
    );

    estadosVisitados.value.clear();

    simuladorStore.velocidadSimulacion = velocidadAnimacion.value;

    simuladorStore.iniciarSimulacion(entradaSimulacion.value);

    if (simuladorStore.estadoActual) {
      estadosVisitados.value.add(simuladorStore.estadoActual);
    }

    await simularConAnimacion();
  };

  const simularConAnimacion = async () => {
    simuladorStore.simulacionAutomaticaActiva = true;
    let maxPasos = 10000;

    console.log("=== INICIANDO SIMULACIÓN PASO A PASO ===");

    while (simuladorStore.enSimulacion && maxPasos > 0) {
      if (!simuladorStore.pausado) {
        const estadoAnterior = simuladorStore.estadoActual;
        console.log(
          `[Antes de paso] Estado: ${estadoAnterior}, enSimulacion: ${simuladorStore.enSimulacion}`
        );

        const continuar = simuladorStore.ejecutarPaso();

        console.log(
          `[Después de paso] Estado: ${simuladorStore.estadoActual}, continuar: ${continuar}, enSimulacion: ${simuladorStore.enSimulacion}`
        );

        if (estadoAnterior && simuladorStore.estadoActual) {
          await animarTransicion(estadoAnterior, simuladorStore.estadoActual);

          estadosVisitados.value.add(simuladorStore.estadoActual);
        }

        maxPasos--;
        await new Promise((resolve) =>
          setTimeout(resolve, velocidadAnimacion.value / 2)
        );

        if (!continuar) break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    simuladorStore.simulacionAutomaticaActiva = false;

    console.log("=== FIN SIMULACIÓN ===");
    console.log("Historial:", simuladorStore.historialPasos);

    const ultimoPaso =
      simuladorStore.historialPasos[simuladorStore.historialPasos.length - 1];
    if (ultimoPaso) {
      console.log("Último paso:", ultimoPaso);
      const nodoFinal = nodosStore.nodos.find(
        (n) => n.id === ultimoPaso.estadoActual
      );
      console.log("Nodo final encontrado:", nodoFinal);
      if (nodoFinal?.esFinal) {
        useModal.openModal(
          "✅ Cadena ACEPTADA",
          `Estado final: ${nodoFinal.label}\nPasos: ${simuladorStore.pasoActual}`
        );
      } else {
        useModal.openModal(
          "❌ Cadena RECHAZADA",
          `${ultimoPaso.mensaje}\nPasos: ${simuladorStore.pasoActual}`
        );
      }
    }
  };

  const ejecutarUnPasoAnimado = async () => {
    if (!simuladorStore.enSimulacion) {
      const validacion = simuladorStore.validarConfiguracion();
      if (!validacion.valida) {
        useModal.openModal(
          "Configuración inválida",
          validacion.errores.join("\n")
        );
        return;
      }

      if (!entradaSimulacion.value.trim()) {
        useModal.openModal(
          "Error de entrada",
          "Por favor ingresa una cadena de entrada"
        );
        return;
      }

      estadosVisitados.value.clear();
      simuladorStore.iniciarSimulacion(entradaSimulacion.value);

      if (simuladorStore.estadoActual) {
        estadosVisitados.value.add(simuladorStore.estadoActual);
      }
      return;
    }

    const estadoAnterior = simuladorStore.estadoActual;
    simuladorStore.ejecutarPaso();

    if (estadoAnterior && simuladorStore.estadoActual) {
      await animarTransicion(estadoAnterior, simuladorStore.estadoActual);
      estadosVisitados.value.add(simuladorStore.estadoActual);
    }
  };

  const togglePausa = () => {
    simuladorStore.togglePausa();
  };

  const reiniciarSimulacion = () => {
    simuladorStore.reiniciar();
    estadosVisitados.value.clear();
    conexionActiva.value = null;
  };

  return {
    conexionActiva,
    velocidadAnimacion,
    estadosVisitados,
    entradaSimulacion,
    iniciarSimulacionAnimada,
    simularConAnimacion,
    ejecutarUnPasoAnimado,
    togglePausa,
    reiniciarSimulacion,
  };
});

export default useSimulationAnimatedStore;
