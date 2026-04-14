import { defineStore } from "pinia";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";
import { storeToRefs } from "pinia";
import { useSimuladorDFAStore } from "./simuladorDFA";
import useStateTransitionDFAStore from "./stateTransitionDFA";

const useSimulationAnimatedDFAStore = defineStore(
  "simulacionAnimadaDFA",
  () => {
    const useModal = useModalStore();
    const simuladorDFAStore = useSimuladorDFAStore();
    const nodosStore = useNodosStore();
    const useStateTransitionDFA = useStateTransitionDFAStore();

    const { conexiones } = storeToRefs(nodosStore);
    const {
      conexionActiva,
      velocidadAnimacion,
      estadosVisitados,
      entradaSimulacion,
    } = storeToRefs(useStateTransitionDFA);

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
      const validacion = simuladorDFAStore.validarConfiguracion();
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

      console.log("=== INICIO SIMULACIÓN DFA ===");
      console.log("Entrada:", entradaSimulacion.value);
      console.log(
        "Nodos:",
        nodosStore.nodos.map((n) => ({
          id: n.id,
          label: n.label,
          esInicial: n.esInicial,
          esFinal: n.esFinal,
          transicionesDFA: n.transicionesDFA?.map((t) => ({
            simbolo: t.simbolo,
            proximo: t.proximoEstado,
          })),
        }))
      );

      estadosVisitados.value.clear();

      simuladorDFAStore.velocidadSimulacion = velocidadAnimacion.value;

      simuladorDFAStore.iniciarSimulacion(entradaSimulacion.value);

      if (simuladorDFAStore.estadoActual) {
        estadosVisitados.value.add(simuladorDFAStore.estadoActual);
      }

      await simularConAnimacion();
    };

    const simularConAnimacion = async () => {
      simuladorDFAStore.simulacionAutomaticaActiva = true;
      let maxPasos = 10000;

      console.log("=== INICIANDO SIMULACIÓN DFA PASO A PASO ===");

      while (simuladorDFAStore.enSimulacion && maxPasos > 0) {
        if (!simuladorDFAStore.pausado) {
          const estadoAnterior = simuladorDFAStore.estadoActual;
          console.log(
            `[DFA Antes de paso] Estado: ${estadoAnterior}, enSimulacion: ${simuladorDFAStore.enSimulacion}`
          );

          const continuar = simuladorDFAStore.ejecutarPaso();

          console.log(
            `[DFA Después de paso] Estado: ${simuladorDFAStore.estadoActual}, continuar: ${continuar}, enSimulacion: ${simuladorDFAStore.enSimulacion}`
          );

          if (estadoAnterior && simuladorDFAStore.estadoActual) {
            await animarTransicion(
              estadoAnterior,
              simuladorDFAStore.estadoActual
            );

            estadosVisitados.value.add(simuladorDFAStore.estadoActual);
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

      simuladorDFAStore.simulacionAutomaticaActiva = false;

      console.log("=== FIN SIMULACIÓN DFA ===");
      console.log("Historial:", simuladorDFAStore.historialPasos);

      const ultimoPaso =
        simuladorDFAStore.historialPasos[
          simuladorDFAStore.historialPasos.length - 1
        ];
      if (ultimoPaso) {
        console.log("Último paso:", ultimoPaso);
        const nodoFinal = nodosStore.nodos.find(
          (n) => n.id === ultimoPaso.estadoActual
        );
        console.log("Nodo final encontrado:", nodoFinal);
        if (nodoFinal?.esFinal && ultimoPaso.cadenaRestante === "") {
          useModal.openModal(
            "✅ Cadena ACEPTADA",
            `Estado final: ${nodoFinal.label}\nPasos: ${simuladorDFAStore.pasoActual}`
          );
        } else {
          useModal.openModal(
            "❌ Cadena RECHAZADA",
            `${ultimoPaso.mensaje}\nPasos: ${simuladorDFAStore.pasoActual}`
          );
        }
      }
    };

    const ejecutarUnPasoAnimado = async () => {
      if (!simuladorDFAStore.enSimulacion) {
        const validacion = simuladorDFAStore.validarConfiguracion();
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
        simuladorDFAStore.iniciarSimulacion(entradaSimulacion.value);

        if (simuladorDFAStore.estadoActual) {
          estadosVisitados.value.add(simuladorDFAStore.estadoActual);
        }
        return;
      }

      const estadoAnterior = simuladorDFAStore.estadoActual;
      simuladorDFAStore.ejecutarPaso();

      if (estadoAnterior && simuladorDFAStore.estadoActual) {
        await animarTransicion(estadoAnterior, simuladorDFAStore.estadoActual);
        estadosVisitados.value.add(simuladorDFAStore.estadoActual);
      }
    };

    const togglePausa = () => {
      simuladorDFAStore.togglePausa();
    };

    const reiniciarSimulacion = () => {
      simuladorDFAStore.reiniciar();
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
  }
);

export default useSimulationAnimatedDFAStore;
