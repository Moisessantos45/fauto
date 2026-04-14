import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import type { Nodo, TransicionNFA } from "@/types/nodo";
import { EPSILON } from "@/types/nodo";
import useMenusStore from "@/stores/menus";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";

const useStateTransitionNFAStore = defineStore("stateTransitionNFA", () => {
  const useModal = useModalStore();
  const menusStore = useMenusStore();
  const { modalVisible } = storeToRefs(menusStore);

  const nodosStore = useNodosStore();
  const panelTransiciones = ref<HTMLElement | null>(null);

  const entradaSimulacion = ref("");
  const modalTransicionVisible = ref(false);
  const velocidadAnimacion = ref(500);
  const estadosVisitados = ref<Set<number>>(new Set());
  const conexionActiva = ref<string | null>(null);

  const estadoEditandoId = ref<number | null>(null);

  const estadoFormulario = reactive({
    nombre: "",
    esInicial: false,
    esFinal: false,
    transicionesNFA: [] as TransicionNFA[],
  });

  const transicionFormulario = reactive({
    simbolo: "",
    esEpsilon: false,
    proximoEstado: "",
  });

  let onConfirmAction: (() => void) | null = null;

  const openConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    useModal.openModal(title, message, true);
    onConfirmAction = onConfirm;
  };

  const guardarEstado = () => {
    if (!estadoFormulario.nombre.trim()) {
      useModal.openModal(
        "Error de validación",
        "Por favor ingresa un nombre para el estado"
      );
      return;
    }

    // Validar que el nombre no esté duplicado
    const nombreNormalizado = estadoFormulario.nombre.trim();
    const existeNombreDuplicado = nodosStore.nodos.some(
      (n) => n.label === nombreNormalizado && n.id !== estadoEditandoId.value
    );

    if (existeNombreDuplicado) {
      useModal.openModal(
        "Error de validación",
        `Ya existe un estado con el nombre "${nombreNormalizado}". Cada estado debe tener un nombre único.`
      );
      return;
    }

    let nodoId: number;

    if (estadoEditandoId.value !== null) {
      nodoId = estadoEditandoId.value;
      const nodo = nodosStore.nodos.find((n) => n.id === nodoId);
      if (nodo) {
        nodo.label = estadoFormulario.nombre;
        nodo.esFinal = estadoFormulario.esFinal;

        if (estadoFormulario.esInicial) {
          nodosStore.nodos.forEach(
            (n) => (n.esInicial = n.id === estadoEditandoId.value)
          );
        } else {
          nodo.esInicial = false;
        }

        nodo.transicionesNFA = [...estadoFormulario.transicionesNFA];

        nodosStore.sincronizarConexionesDeNodoNFA(nodoId);
      }
    } else {
      const nuevoEstado = nodosStore.agregarEstado(
        estadoFormulario.nombre,
        Math.random() * 600 + 100,
        Math.random() * 400 + 100,
        estadoFormulario.esInicial,
        estadoFormulario.esFinal
      );

      nodoId = nuevoEstado.id;
      nuevoEstado.transicionesNFA = [];

      estadoFormulario.transicionesNFA.forEach((trans) => {
        nodosStore.agregarTransicionNFA(
          nuevoEstado.id,
          trans.simbolo,
          trans.proximoEstado
        );
      });

      setTimeout(() => {
        const element = document.querySelector(
          `[data-nodo-id="${nuevoEstado.id}"]`
        ) as HTMLElement;
        if (element) {
          nuevoEstado.elemento = element;
        }
        nodosStore.sincronizarConexionesDeNodoNFA(nodoId);
      }, 100);
    }

    cerrarModal();
  };

  const agregarTransicion = () => {
    // Si es epsilon, usar el símbolo epsilon
    const simboloFinal = transicionFormulario.esEpsilon
      ? EPSILON
      : transicionFormulario.simbolo.trim();

    if (!simboloFinal || !transicionFormulario.proximoEstado) {
      useModal.openModal(
        "Error de validación",
        "Por favor completa todos los campos de la transición"
      );
      return;
    }

    estadoFormulario.transicionesNFA.push({
      id: `trans-nfa-${Date.now()}`,
      simbolo: simboloFinal,
      proximoEstado: parseInt(transicionFormulario.proximoEstado as any),
    });

    transicionFormulario.simbolo = "";
    transicionFormulario.esEpsilon = false;
    transicionFormulario.proximoEstado = "";
    modalTransicionVisible.value = false;
  };

  const cerrarModal = () => {
    modalVisible.value = false;
    estadoEditandoId.value = null;
    estadoFormulario.nombre = "";
    estadoFormulario.esInicial = false;
    estadoFormulario.esFinal = false;
    estadoFormulario.transicionesNFA = [];
  };

  const editarEstado = (nodo: Nodo) => {
    estadoEditandoId.value = nodo.id;
    estadoFormulario.nombre = nodo.label;
    estadoFormulario.esInicial = nodo.esInicial;
    estadoFormulario.esFinal = nodo.esFinal;
    estadoFormulario.transicionesNFA = [...(nodo.transicionesNFA || [])];
    modalVisible.value = true;
  };

  const eliminarEstadoActual = () => {
    const idParaEliminar = estadoEditandoId.value;
    if (idParaEliminar === null) return;

    const nodo = nodosStore.nodos.find((n) => n.id === idParaEliminar);
    if (!nodo) return;

    openConfirmModal(
      "Confirmar Eliminación",
      `¿Estás seguro que deseas eliminar el estado "${nodo.label}" y todas sus conexiones?`,
      () => {
        nodosStore.eliminarEstado(idParaEliminar);
        cerrarModal();
      }
    );
  };

  const handleConfirm = () => {
    if (onConfirmAction) {
      onConfirmAction();
    }
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    useModal.closeModal();
    onConfirmAction = null;
  };

  return {
    panelTransiciones,
    entradaSimulacion,
    modalTransicionVisible,
    velocidadAnimacion,
    estadosVisitados,
    conexionActiva,
    estadoEditandoId,
    estadoFormulario,
    transicionFormulario,
    guardarEstado,
    agregarTransicion,
    cerrarModal,
    editarEstado,
    eliminarEstadoActual,
    openConfirmModal,
    handleConfirm,
    closeConfirmModal,
  };
});

export default useStateTransitionNFAStore;
