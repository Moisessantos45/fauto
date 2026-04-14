import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import type { Nodo, TransicionDFA } from "@/types/nodo";
import useMenusStore from "@/stores/menus";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";

const useStateTransitionDFAStore = defineStore("stateTransitionDFA", () => {
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
    transicionesDFA: [] as TransicionDFA[],
  });

  const transicionFormulario = reactive({
    simbolo: "",
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

        nodo.transicionesDFA = [...estadoFormulario.transicionesDFA];

        nodosStore.sincronizarConexionesDeNodoDFA(nodoId);
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
      nuevoEstado.transicionesDFA = [];

      estadoFormulario.transicionesDFA.forEach((trans) => {
        nodosStore.agregarTransicionDFA(
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
        nodosStore.sincronizarConexionesDeNodoDFA(nodoId);
      }, 100);
    }

    cerrarModal();
  };

  const agregarTransicion = () => {
    if (
      !transicionFormulario.simbolo.trim() ||
      !transicionFormulario.proximoEstado
    ) {
      useModal.openModal(
        "Error de validación",
        "Por favor completa todos los campos de la transición"
      );
      return;
    }

    estadoFormulario.transicionesDFA.push({
      id: `trans-dfa-${Date.now()}`,
      simbolo: transicionFormulario.simbolo,
      proximoEstado: parseInt(transicionFormulario.proximoEstado as any),
    });

    transicionFormulario.simbolo = "";
    transicionFormulario.proximoEstado = "";
    modalTransicionVisible.value = false;
  };

  const cerrarModal = () => {
    modalVisible.value = false;
    estadoEditandoId.value = null;
    estadoFormulario.nombre = "";
    estadoFormulario.esInicial = false;
    estadoFormulario.esFinal = false;
    estadoFormulario.transicionesDFA = [];
  };

  const editarEstado = (nodo: Nodo) => {
    estadoEditandoId.value = nodo.id;
    estadoFormulario.nombre = nodo.label;
    estadoFormulario.esInicial = nodo.esInicial;
    estadoFormulario.esFinal = nodo.esFinal;
    estadoFormulario.transicionesDFA = [...(nodo.transicionesDFA || [])];
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

export default useStateTransitionDFAStore;
