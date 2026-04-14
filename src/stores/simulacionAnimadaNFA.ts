import { defineStore } from "pinia";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";
import { storeToRefs } from "pinia";
import { useSimuladorNFAStore } from "./simuladorNFA";
import useStateTransitionNFAStore from "./stateTransitionNFA";

const useSimulationAnimatedNFAStore = defineStore(
  "simulacionAnimadaNFA",
  () => {
    const useModal = useModalStore();
    const simuladorNFAStore = useSimuladorNFAStore();
    const nodosStore = useNodosStore();
    const useStateTransitionNFA = useStateTransitionNFAStore();

    const { conexiones } = storeToRefs(nodosStore);
    const {
      conexionActiva,
      velocidadAnimacion,
      estadosVisitados,
      entradaSimulacion,
    } = storeToRefs(useStateTransitionNFA);

    const animarTransiciones = async (
      estadosOrigen: number[],
      estadosDestino: number[]
    ) => {
      // Animar todas las conexiones entre estados origen y destino
      const conexionesAAnimar: string[] = [];

      conexiones.value.forEach((conn, connId) => {
        const origenId = parseInt(
          conn.origen.getAttribute("data-nodo-id") || "-1"
        );
        const destinoId = parseInt(
          conn.destino.getAttribute("data-nodo-id") || "-1"
        );

        if (
          estadosOrigen.includes(origenId) &&
          estadosDestino.includes(destinoId)
        ) {
          conexionesAAnimar.push(connId);
        }
      });

      // Activar animación en todas las conexiones
      conexionesAAnimar.forEach((connId) => {
        const pathElement = document.getElementById(connId);
        if (pathElement) {
          pathElement.classList.add("conexion-activa");
        }
      });

      await new Promise((resolve) =>
        setTimeout(resolve, velocidadAnimacion.value / 2)
      );

      // Desactivar animación
      conexionesAAnimar.forEach((connId) => {
        const pathElement = document.getElementById(connId);
        if (pathElement) {
          pathElement.classList.remove("conexion-activa");
        }
      });
    };

    const iniciarSimulacionAnimada = async () => {
      const validacion = simuladorNFAStore.validarConfiguracion();
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

      console.log("=== INICIO SIMULACIÓN NFA ===");
      console.log("Entrada:", entradaSimulacion.value);

      estadosVisitados.value.clear();

      simuladorNFAStore.velocidadSimulacion = velocidadAnimacion.value;

      simuladorNFAStore.iniciarSimulacion(entradaSimulacion.value);

      // Marcar estados iniciales como visitados
      simuladorNFAStore.estadosActuales.forEach((estadoId) => {
        estadosVisitados.value.add(estadoId);
      });

      await simularConAnimacion();
    };

    const simularConAnimacion = async () => {
      simuladorNFAStore.simulacionAutomaticaActiva = true;
      let maxPasos = 10000;

      console.log("=== INICIANDO SIMULACIÓN NFA PASO A PASO ===");

      while (simuladorNFAStore.enSimulacion && maxPasos > 0) {
        if (!simuladorNFAStore.pausado) {
          const estadosAnteriores = Array.from(
            simuladorNFAStore.estadosActuales
          );

          const continuar = simuladorNFAStore.ejecutarPaso();

          const estadosNuevos = Array.from(simuladorNFAStore.estadosActuales);

          if (estadosAnteriores.length > 0 && estadosNuevos.length > 0) {
            await animarTransiciones(estadosAnteriores, estadosNuevos);

            estadosNuevos.forEach((estadoId) => {
              estadosVisitados.value.add(estadoId);
            });
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

      simuladorNFAStore.simulacionAutomaticaActiva = false;

      console.log("=== FIN SIMULACIÓN NFA ===");

      const ultimoPaso =
        simuladorNFAStore.historialPasos[
          simuladorNFAStore.historialPasos.length - 1
        ];
      if (ultimoPaso) {
        // Verificar si algún estado final está activo
        const estadosFinalesActivos = ultimoPaso.estadosActuales.filter(
          (estadoId) => {
            const nodo = nodosStore.nodos.find((n) => n.id === estadoId);
            return nodo?.esFinal;
          }
        );

        if (
          estadosFinalesActivos.length > 0 &&
          ultimoPaso.cadenaRestante === ""
        ) {
          const labels = estadosFinalesActivos
            .map((id) => nodosStore.nodos.find((n) => n.id === id)?.label)
            .join(", ");
          useModal.openModal(
            "✅ Cadena ACEPTADA",
            `Estados finales alcanzados: ${labels}\nPasos: ${simuladorNFAStore.pasoActual}`
          );
        } else {
          useModal.openModal(
            "❌ Cadena RECHAZADA",
            `${ultimoPaso.mensaje}\nPasos: ${simuladorNFAStore.pasoActual}`
          );
        }
      }
    };

    const ejecutarUnPasoAnimado = async () => {
      if (!simuladorNFAStore.enSimulacion) {
        const validacion = simuladorNFAStore.validarConfiguracion();
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
        simuladorNFAStore.iniciarSimulacion(entradaSimulacion.value);

        simuladorNFAStore.estadosActuales.forEach((estadoId) => {
          estadosVisitados.value.add(estadoId);
        });
        return;
      }

      const estadosAnteriores = Array.from(simuladorNFAStore.estadosActuales);
      simuladorNFAStore.ejecutarPaso();
      const estadosNuevos = Array.from(simuladorNFAStore.estadosActuales);

      if (estadosAnteriores.length > 0 && estadosNuevos.length > 0) {
        await animarTransiciones(estadosAnteriores, estadosNuevos);
        estadosNuevos.forEach((estadoId) => {
          estadosVisitados.value.add(estadoId);
        });
      }
    };

    const togglePausa = () => {
      simuladorNFAStore.togglePausa();
    };

    const reiniciarSimulacion = () => {
      simuladorNFAStore.reiniciar();
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

export default useSimulationAnimatedNFAStore;
