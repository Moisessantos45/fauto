<template>
    <main class="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 relative">
        <div class="h-1 bg-linear-to-r from-teal-500 to-emerald-400"></div>

        <aside id="menu" ref="menu"
            class="menu flex flex-col absolute w-[320px] max-h-[90vh] p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl top-20 left-5 overflow-y-auto z-20 cursor-grab user-select-none gap-4 scrollbar_styled">

            <div class="pb-3 border-b border-slate-100">
                <div class="flex items-center gap-2 mb-2">
                    <div
                        class="w-8 h-8 rounded-full bg-linear-to-r from-teal-500 to-emerald-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        TM
                    </div>
                    <h2 class="text-lg font-bold text-slate-800">
                        Máquina de Turing</h2>
                </div>
                <p class="text-xs text-slate-500">Diseña, simula y visualiza</p>
            </div>

            <div class="pt-1">
                <h3 class="font-semibold text-sm text-slate-700 mb-2">✏️ Edición</h3>
                <button type="button" @click="modalVisible = true" title="Agregar nuevo estado" id="open-add-node-btn"
                    class="w-full bg-teal-50 text-teal-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-100 transition cursor-pointer text-sm shadow-sm">
                    ➕ Agregar Estado
                </button>
            </div>

            <div class="pt-1">
                <h3 class="font-semibold text-sm text-slate-700 mb-2">▶️ Simulación</h3>
                <div class="flex flex-col gap-2">
                    <label for="input-nodo" class="block text-xs font-medium text-slate-600">Cadena de Entrada:</label>
                    <input type="text" v-model="entradaSimulacion" name="input-nodo" id="input-nodo"
                        :disabled="simuladorStore.enSimulacion" placeholder="Ej: 110101"
                        class="border border-slate-200 rounded-lg p-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 bg-slate-50/50 transition" />

                    <!-- Control de velocidad -->
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-slate-600 whitespace-nowrap">Velocidad:</label>
                        <input type="range" v-model.number="velocidadAnimacion" min="100" max="2000" step="100"
                            class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                        <span class="text-xs text-slate-500 w-12 text-right">{{ velocidadAnimacion }}ms</span>
                    </div>

                    <button @click="iniciarSimulacionAnimada" :disabled="simuladorStore.enSimulacion"
                        title="Iniciar simulación con animación" type="button"
                        class="w-full bg-teal-500 text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-teal-600 hover:shadow-md transition cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                        ▶ Simular Completo
                    </button>

                    <div class="flex gap-2">
                        <button @click="ejecutarUnPasoAnimado" :disabled="simuladorStore.simulacionAutomaticaActiva"
                            class="flex-1 bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ejecutar un paso">
                            ⏭ Paso
                        </button>
                        <button @click="togglePausa" :disabled="!simuladorStore.simulacionAutomaticaActiva"
                            class="flex-1 px-3 py-2.5 rounded-lg font-semibold transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="simuladorStore.pausado ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'"
                            :title="simuladorStore.pausado ? 'Reanudar' : 'Pausar'">
                            {{ simuladorStore.pausado ? '▶ Reanudar' : '⏸ Pausar' }}
                        </button>
                    </div>

                    <button @click="reiniciarSimulacion"
                        :disabled="!simuladorStore.enSimulacion && simuladorStore.historialPasos.length === 0"
                        class="w-full bg-slate-100 text-slate-600 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Reiniciar simulación">
                        🔄 Reiniciar
                    </button>
                </div>
            </div>

            <div v-if="simuladorStore.historialPasos.length > 0" class="pt-1">
                <h3 class="font-semibold text-sm text-slate-700 mb-2">📊 Estado Actual</h3>
                <div class="bg-teal-50/70 p-3 rounded-lg text-xs space-y-2">
                    <div class="flex justify-between">
                        <span class="text-slate-600 font-medium">Paso:</span>
                        <span class="text-teal-700 font-mono font-bold">{{ simuladorStore.pasoActual }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-600 font-medium">Estado:</span>
                        <span class="text-amber-600 font-mono font-bold">{{
                            simuladorStore.estadoActual ? nodosStore.nodos.find(n => n.id ===
                                simuladorStore.estadoActual)?.label : 'N/A'}}</span>
                    </div>

                    <!-- Visualización de la cinta mejorada -->
                    <div class="mt-2">
                        <span class="text-slate-600 font-medium block mb-1">Cinta:</span>
                        <div class="flex flex-wrap gap-0.5 justify-center bg-slate-100 p-2 rounded-lg">
                            <div v-for="(simbolo, idx) in simuladorStore.cinta" :key="idx"
                                class="w-7 h-7 flex items-center justify-center font-mono text-sm font-bold border transition-all duration-200"
                                :class="idx === simuladorStore.posicionCabeza
                                    ? 'bg-amber-400 text-amber-900 border-amber-500 scale-110 shadow-md rounded'
                                    : 'bg-white text-slate-700 border-slate-300 rounded-sm'">
                                {{ simbolo }}
                            </div>
                        </div>
                        <div class="text-center text-[10px] text-slate-400 mt-1">
                            ▲ Cabezal en posición {{ simuladorStore.posicionCabeza }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-1">
                <h3 class="font-semibold text-sm text-slate-700 mb-2">🛠️ Utilidades</h3>
                <button @click="limpiarLienzo"
                    class="w-full bg-red-50 text-red-600 px-3 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition cursor-pointer text-sm mb-2">
                    🗑 Limpiar Lienzo
                </button>
                <div class="flex gap-2">
                    <button @click="exportarJSON"
                        class="flex-1 bg-slate-700 text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer text-sm shadow-sm">
                        📥 Exportar
                    </button>
                    <button @click="importarJSON"
                        class="flex-1 bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm">
                        📤 Importar
                    </button>
                </div>
            </div>
        </aside>

        <ModalEstado :visible="modalVisible" :formulario="estadoFormulario" :editando-id="estadoEditandoId"
            :nodos="nodosStore.nodos" @close="cerrarModal" @submit="guardarEstado"
            @open-transicion="modalTransicionVisible = true" @delete="eliminarEstadoActual" />

        <ModalTransicion :visible="modalTransicionVisible" :formulario="transicionFormulario" :nodos="nodosStore.nodos"
            @close="modalTransicionVisible = false" @submit="agregarTransicion" />

        <ModalMessage
            :visible="showMessageModal"
            :title="messageModalTitle"
            :message="messageModalMessage"
            @close="closeMessageModal"
        />

        <ModalConfirm
            :visible="showConfirmModal"
            :title="confirmModalTitle"
            :message="confirmModalMessage"
            @confirm="handleConfirm"
            @cancel="closeConfirmModal"
        />

        <svg id="svg-lienzo" ref="svgLienzoRef"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto; z-index: 5;">
            <defs>
                <linearGradient id="gradient-azul" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#14b8a6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                </linearGradient>

                <marker id="puntaFlecha" viewBox="0 0 35 35" refX="28" refY="15" markerWidth="15" markerHeight="15"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 30 15 L 0 30 Z" fill="#14b8a6" stroke="#10b981" stroke-width="0.5" />
                </marker>
                <marker id="puntaFlechaPeq" viewBox="0 0 20 20" refX="18" refY="10" markerWidth="10" markerHeight="10"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 20 10 L 0 20 Z" fill="#14b8a6" stroke="#10b981" stroke-width="0.5" />
                </marker>
            </defs>
        </svg>

        <div v-for="nodo in nodosStore.nodos" :key="nodo.id"
            class="nodo absolute flex flex-col items-center justify-center text-center select-none font-semibold rounded-full touch-none z-10 shadow-md text-xs transition-all duration-300 cursor-grab hover:shadow-lg active:shadow-sm"
            :class="[
                simuladorStore.estadoActual === nodo.id && simuladorStore.enSimulacion ? 'estado-activo' :
                    nodo.esInicial ? 'border-2 border-teal-500 bg-teal-50 text-teal-700' :
                        nodo.esFinal ? 'border-2 border-red-400 bg-red-50 text-red-700' :
                            'border-2 border-slate-300 bg-white text-slate-700',
                { 'conectando-origen': dragState.nodoSeleccionado?.id === nodo.id, 'arrastrando': nodo.id === dragState.nodoEnMovimiento?.id },
                { 'estado-visitado': estadosVisitados.has(nodo.id) && simuladorStore.estadoActual !== nodo.id }
            ]" :style="{ left: `${nodo.x}px`, top: `${nodo.y}px`, width: '70px', height: '70px' }"
            @mousedown="nodosStore.iniciarMovimiento($event, nodo)"
            @click="nodosStore.seleccionarNodoParaConexion($event, nodo)" @contextmenu.prevent="editarEstado(nodo)"
            :data-nodo-id="nodo.id"
            :title="`${nodo.label}${nodo.esInicial ? ' [INICIAL]' : ''}${nodo.esFinal ? ' [FINAL]' : ''}\nClick derecho para editar`">
            <div>{{ nodo.label }}</div>
            <div v-if="nodo.esInicial || nodo.esFinal" class="text-xs mt-1">
                <span v-if="nodo.esInicial" class="text-teal-600 font-bold">●I</span>
                <span v-if="nodo.esFinal" class="text-red-500 font-bold">●F</span>
            </div>
        </div>

        <div v-if="nodosStore.nodos.length > 0" ref="panelTransiciones"
            class="panel-transiciones absolute bottom-5 right-5 w-80 max-h-64 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-20 cursor-grab user-select-none hover:shadow-2xl transition scrollbar_styled"
            @mousedown="initializeMenuElements">
            <h3 class="font-semibold text-slate-800 mb-3 cursor-grab">
                📋 Info de Transiciones</h3>
            <div v-if="nodosStore.nodos.length > 0" class="text-xs space-y-2">
                <div v-for="nodo in nodosStore.nodos" :key="nodo.id" class="mb-3 p-2.5 bg-slate-50/80 rounded-lg">
                    <p class="font-semibold text-slate-700 mb-1">{{
                        nodo.label }}</p>
                    <div v-if="nodo.transiciones.length === 0" class="text-slate-400 text-xs italic">Sin transiciones
                    </div>
                    <div v-for="(trans, idx) in nodo.transiciones" :key="idx"
                        class="text-slate-600 ml-2 font-mono text-xs">
                        • '{{ trans.simboloLee }}' → '{{ trans.simboloEscribe }}' <span class="text-teal-600">({{
                            trans.movimiento }})</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia';
import useMenusStore from '@/stores/menus';
import useNodosStore from '@/stores/nodos';
import { useSimuladorStore } from '@/stores/simulador';
import type { Nodo, Transicion } from '@/types/nodo';
import ModalEstado from '@/components/ModalEstado.vue';
import ModalTransicion from '@/components/ModalTransicion.vue';
import ModalMessage from '@/components/ModalMessage.vue';
import ModalConfirm from '@/components/ModalConfirm.vue'; // New import

const menusStore = useMenusStore();
const { menu, modalVisible } = storeToRefs(menusStore);

const nodosStore = useNodosStore();
const { svgLienzoRef, conexiones, nodos, dragState } = storeToRefs(nodosStore);

const simuladorStore = useSimuladorStore();

const panelTransiciones = ref<HTMLElement | null>(null);

const entradaSimulacion = ref('');
const modalTransicionVisible = ref(false);
const velocidadAnimacion = ref(500);
const estadosVisitados = ref<Set<number>>(new Set());
const conexionActiva = ref<string | null>(null);

const estadoEditandoId = ref<number | null>(null);

const estadoFormulario = reactive({
    nombre: '',
    esInicial: false,
    esFinal: false,
    transiciones: [] as Transicion[],
});

const transicionFormulario = reactive({
    simboloLee: '',
    simboloEscribe: '',
    movimiento: 'R' as 'L' | 'R' | 'S',
    proximoEstado: '',
});

const showMessageModal = ref(false);
const messageModalTitle = ref('');
const messageModalMessage = ref('');

const openMessageModal = (title: string, message: string) => {
    messageModalTitle.value = title;
    messageModalMessage.value = message;
    showMessageModal.value = true;
};

const closeMessageModal = () => {
    showMessageModal.value = false;
    messageModalTitle.value = '';
    messageModalMessage.value = '';
};

const showConfirmModal = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
let onConfirmAction: (() => void) | null = null;

const openConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    confirmModalTitle.value = title;
    confirmModalMessage.value = message;
    onConfirmAction = onConfirm;
    showConfirmModal.value = true;
};

const handleConfirm = () => {
    if (onConfirmAction) {
        onConfirmAction();
    }
    closeConfirmModal();
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    confirmModalTitle.value = '';
    confirmModalMessage.value = '';
    onConfirmAction = null;
};


const guardarEstado = () => {
    if (!estadoFormulario.nombre.trim()) {
        openMessageModal('Error de validación', 'Por favor ingresa un nombre para el estado');
        return;
    }

    let nodoId: number;

    if (estadoEditandoId.value !== null) {
        nodoId = estadoEditandoId.value;
        const nodo = nodosStore.nodos.find(n => n.id === nodoId);
        if (nodo) {
            nodo.label = estadoFormulario.nombre;
            nodo.esFinal = estadoFormulario.esFinal;

            if (estadoFormulario.esInicial) {
                nodosStore.nodos.forEach(n => n.esInicial = n.id === estadoEditandoId.value);
            } else {
                nodo.esInicial = false;
            }

            nodo.transiciones = [...estadoFormulario.transiciones];

            nodosStore.sincronizarConexionesDeNodo(nodoId);
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

        estadoFormulario.transiciones.forEach(trans => {
            nodosStore.agregarTransicion(
                nuevoEstado.id,
                trans.simboloLee,
                trans.simboloEscribe,
                trans.movimiento,
                trans.proximoEstado
            );
        });

        setTimeout(() => {
            const element = document.querySelector(`[data-nodo-id="${nuevoEstado.id}"]`) as HTMLElement;
            if (element) {
                nuevoEstado.elemento = element;
            }
            nodosStore.sincronizarConexionesDeNodo(nodoId);
        }, 100);
    }

    cerrarModal();
};

const agregarTransicion = () => {
    if (!transicionFormulario.simboloLee.trim() || !transicionFormulario.simboloEscribe.trim() || !transicionFormulario.proximoEstado) {
        openMessageModal('Error de validación', 'Por favor completa todos los campos de la transición');
        return;
    }

    estadoFormulario.transiciones.push({
        id: `trans-${Date.now()}`,
        simboloLee: transicionFormulario.simboloLee,
        simboloEscribe: transicionFormulario.simboloEscribe,
        movimiento: transicionFormulario.movimiento,
        proximoEstado: parseInt(transicionFormulario.proximoEstado as any),
    });

    transicionFormulario.simboloLee = '';
    transicionFormulario.simboloEscribe = '';
    transicionFormulario.movimiento = 'R';
    transicionFormulario.proximoEstado = '';
    modalTransicionVisible.value = false;
};

const cerrarModal = () => {
    modalVisible.value = false;
    estadoEditandoId.value = null;
    estadoFormulario.nombre = '';
    estadoFormulario.esInicial = false;
    estadoFormulario.esFinal = false;
    estadoFormulario.transiciones = [];
};

const editarEstado = (nodo: Nodo) => {
    estadoEditandoId.value = nodo.id;
    estadoFormulario.nombre = nodo.label;
    estadoFormulario.esInicial = nodo.esInicial;
    estadoFormulario.esFinal = nodo.esFinal;
    estadoFormulario.transiciones = [...nodo.transiciones];
    modalVisible.value = true;
};

const eliminarEstadoActual = () => {
    const idParaEliminar = estadoEditandoId.value;
    if (idParaEliminar === null) return;

    const nodo = nodosStore.nodos.find(n => n.id === idParaEliminar);
    if (!nodo) return;

    openConfirmModal(
        'Confirmar Eliminación',
        `¿Estás seguro que deseas eliminar el estado "${nodo.label}" y todas sus conexiones?`,
        () => {
            nodosStore.eliminarEstado(idParaEliminar);
            cerrarModal();
        }
    );
};

const animarTransicion = async (estadoOrigen: number, estadoDestino: number) => {
    let conexionIdEncontrada: string | null = null;

    conexiones.value.forEach((conn, connId) => {
        const origenId = parseInt(conn.origen.getAttribute('data-nodo-id') || '-1');
        const destinoId = parseInt(conn.destino.getAttribute('data-nodo-id') || '-1');

        if (origenId === estadoOrigen && destinoId === estadoDestino) {
            conexionIdEncontrada = connId;
        }
    });

    conexionActiva.value = conexionIdEncontrada;

    if (conexionActiva.value) {
        const pathElement = document.getElementById(conexionActiva.value);
        if (pathElement) {
            pathElement.classList.add('conexion-activa');
        }
    }

    await new Promise(resolve => setTimeout(resolve, velocidadAnimacion.value / 2));

    if (conexionActiva.value) {
        const pathElement = document.getElementById(conexionActiva.value);
        if (pathElement) {
            pathElement.classList.remove('conexion-activa');
        }
    }
    conexionActiva.value = null;
};

const iniciarSimulacionAnimada = async () => {
    const validacion = simuladorStore.validarConfiguracion();
    if (!validacion.valida) {
        openMessageModal('Configuración inválida', validacion.errores.join('\n'));
        return;
    }

    if (!entradaSimulacion.value.trim()) {
        openMessageModal('Error de entrada', 'Por favor ingresa una cadena de entrada');
        return;
    }

    // Debug: mostrar configuración de nodos
    console.log('=== INICIO SIMULACIÓN ===');
    console.log('Entrada:', entradaSimulacion.value);
    console.log('Nodos:', nodosStore.nodos.map(n => ({
        id: n.id,
        label: n.label,
        esInicial: n.esInicial,
        esFinal: n.esFinal,
        transiciones: n.transiciones.map(t => ({
            lee: t.simboloLee,
            escribe: t.simboloEscribe,
            mov: t.movimiento,
            proximo: t.proximoEstado
        }))
    })));

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

    console.log('=== INICIANDO SIMULACIÓN PASO A PASO ===');

    while (simuladorStore.enSimulacion && maxPasos > 0) {
        if (!simuladorStore.pausado) {
            const estadoAnterior = simuladorStore.estadoActual;
            console.log(`[Antes de paso] Estado: ${estadoAnterior}, enSimulacion: ${simuladorStore.enSimulacion}`);
            
            const continuar = simuladorStore.ejecutarPaso();
            
            console.log(`[Después de paso] Estado: ${simuladorStore.estadoActual}, continuar: ${continuar}, enSimulacion: ${simuladorStore.enSimulacion}`);

            if (estadoAnterior && simuladorStore.estadoActual) {
                await animarTransicion(estadoAnterior, simuladorStore.estadoActual);

                estadosVisitados.value.add(simuladorStore.estadoActual);
            }

            maxPasos--;
            await new Promise(resolve => setTimeout(resolve, velocidadAnimacion.value / 2));

            if (!continuar) break;
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    simuladorStore.simulacionAutomaticaActiva = false;

    console.log('=== FIN SIMULACIÓN ===');
    console.log('Historial:', simuladorStore.historialPasos);

    const ultimoPaso = simuladorStore.historialPasos[simuladorStore.historialPasos.length - 1];
    if (ultimoPaso) {
        console.log('Último paso:', ultimoPaso);
        const nodoFinal = nodosStore.nodos.find(n => n.id === ultimoPaso.estadoActual);
        console.log('Nodo final encontrado:', nodoFinal);
        if (nodoFinal?.esFinal) {
            openMessageModal('✅ Cadena ACEPTADA', `Estado final: ${nodoFinal.label}\nPasos: ${simuladorStore.pasoActual}`);
        } else {
            openMessageModal('❌ Cadena RECHAZADA', `${ultimoPaso.mensaje}\nPasos: ${simuladorStore.pasoActual}`);
        }
    }
};

const ejecutarUnPasoAnimado = async () => {
    if (!simuladorStore.enSimulacion) {
        const validacion = simuladorStore.validarConfiguracion();
        if (!validacion.valida) {
            openMessageModal('Configuración inválida', validacion.errores.join('\n'));
            return;
        }

        if (!entradaSimulacion.value.trim()) {
            openMessageModal('Error de entrada', 'Por favor ingresa una cadena de entrada');
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

const limpiarLienzo = () => {
    openConfirmModal(
        'Confirmar Limpieza de Lienzo',
        '¿Estás seguro que deseas limpiar el lienzo? Esto eliminará todos los estados y conexiones.',
        () => {
            nodosStore.limpiarLienzo();
            simuladorStore.reiniciar();
        }
    );
};

const exportarJSON = () => {
    const json = nodosStore.exportarJSON();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', 'maquina-turing.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const importarJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
            try {
                nodosStore.importarJSON(event.target.result);
                openMessageModal('Importación exitosa', 'Configuración importada exitosamente');
            } catch (error) {
                openMessageModal('Error al importar', 'Error al importar: ' + error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

const initializeMenuElements = (e: MouseEvent) => {
    menusStore.initializeMenuElements(e);

};

window.addEventListener('resize', () => {
    conexiones.value.forEach((conn, id) => {
        nodosStore.dibujarOActualizarConexion(conn.origen, conn.destino, id)
    })
})

onMounted(() => {
    menusStore.setupEventListenersMenu();

    setTimeout(() => {
        nodos.value.forEach(nodo => {
            const element = document.querySelector(`[data-nodo-id="${nodo.id}"]`) as HTMLElement
            if (element) {
                nodo.elemento = element
            }
        })
    }, 100)
});

onBeforeUnmount(() => {
    menusStore.removeEventListenersMenu();
    nodosStore.removeEventListenersNodes();
});
</script>

<style scoped>
.modal_add_node {
    width: 30%;
    height: 35%;
    top: 30%;
    left: 30%;
    position: fixed;
    display: none;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    border: none;
    backdrop-filter: blur(10px);
    z-index: 25;
}

.nodo.arrastrando {
    transition: none;
}

.nodo.conectando-origen {
    border-color: #14b8a6;
    box-shadow: 0 0 20px rgba(20, 184, 166, 0.4), 0 4px 15px rgba(16, 185, 129, 0.3);
    animation: pulse 1.5s ease-in-out infinite;
}

#svg-lienzo {
    background: rgba(248, 250, 252, 0.7);
}

path {
    pointer-events: stroke;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    stroke: url(#gradient-azul);
}

circle.control-point {
    cursor: grab;
    fill: #14b8a6;
}

circle.control-point:hover {
    filter: brightness(1.2);
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.estado-activo {
    border: 3px solid #f59e0b !important;
    background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
    color: #92400e !important;
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.3) !important;
    transform: scale(1.1);
    animation: pulseActivo 0.8s ease-in-out infinite;
    z-index: 15 !important;
}

.estado-visitado {
    border-color: #6ee7b7 !important;
    background-color: #d1fae5 !important;
}

@keyframes pulseActivo {

    0%,
    100% {
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.3);
    }

    50% {
        box-shadow: 0 0 35px rgba(245, 158, 11, 0.8), 0 0 70px rgba(245, 158, 11, 0.5);
    }
}

/* Conexión activa durante simulación */
:deep(.conexion-activa) {
    stroke: #f59e0b !important;
    stroke-width: 5px !important;
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.9)) !important;
    animation: pulseConexion 0.3s ease-in-out;
}

@keyframes pulseConexion {
    0% {
        stroke-width: 3px;
        filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.5));
    }

    50% {
        stroke-width: 7px;
        filter: drop-shadow(0 0 15px rgba(245, 158, 11, 1));
    }

    100% {
        stroke-width: 5px;
        filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.9));
    }
}

.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #14b8a6;
    border: 2px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background-color: #f1f5f9;
    border-radius: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background-color: #0d9488;
}
</style>