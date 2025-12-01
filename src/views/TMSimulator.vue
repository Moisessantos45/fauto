<template>
    <main class="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 relative">
        <div class="h-1 bg-linear-to-r from-teal-500 to-emerald-400"></div>

        <aside id="menu" ref="menu"
            class="menu flex flex-col absolute w-[320px] max-h-[90vh] p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl top-20 right-5 overflow-y-auto z-20 cursor-grab user-select-none gap-4 scrollbar_styled border border-slate-200">

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

                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-slate-600 whitespace-nowrap">Velocidad:</label>
                        <input type="range" v-model.number="velocidadAnimacion" min="100" max="2000" step="100"
                            class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                        <span class="text-xs text-slate-500 w-12 text-right">{{ velocidadAnimacion }}ms</span>
                    </div>

                    <button @click="simulacionAnimadaStore.iniciarSimulacionAnimada"
                        :disabled="simuladorStore.enSimulacion" title="Iniciar simulación con animación" type="button"
                        class="w-full bg-teal-500 text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-teal-600 hover:shadow-md transition cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                        ▶ Simular Completo
                    </button>

                    <div class="flex gap-2">
                        <button @click="simulacionAnimadaStore.ejecutarUnPasoAnimado"
                            :disabled="simuladorStore.simulacionAutomaticaActiva"
                            class="flex-1 bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ejecutar un paso">
                            ⏭ Paso
                        </button>
                        <button @click="simulacionAnimadaStore.togglePausa"
                            :disabled="!simuladorStore.simulacionAutomaticaActiva"
                            class="flex-1 px-3 py-2.5 rounded-lg font-semibold transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="simuladorStore.pausado ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'"
                            :title="simuladorStore.pausado ? 'Reanudar' : 'Pausar'">
                            {{ simuladorStore.pausado ? '▶ Reanudar' : '⏸ Pausar' }}
                        </button>
                    </div>

                    <button @click="simulacionAnimadaStore.reiniciarSimulacion"
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
                    <button @click="jsonExportImport.exportarJSON"
                        class="flex-1 bg-slate-700 text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer text-sm shadow-sm">
                        📥 Exportar
                    </button>
                    <button @click="jsonExportImport.importarJSON"
                        class="flex-1 bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm">
                        📤 Importar
                    </button>
                </div>
            </div>
        </aside>

        <ModalEstado :visible="modalVisible" :formulario="estadoFormulario" :editando-id="estadoEditandoId"
            :nodos="nodosStore.nodos" @close="useStateTransition.cerrarModal" @submit="useStateTransition.guardarEstado"
            @open-transicion="modalTransicionVisible = true" @delete="useStateTransition.eliminarEstadoActual" />

        <ModalTransicion :visible="modalTransicionVisible" :formulario="transicionFormulario" :nodos="nodosStore.nodos"
            @close="modalTransicionVisible = false" @submit="useStateTransition.agregarTransicion" />

        <ModalMessage @close="useModal.closeModal" />

        <ModalConfirm @confirm="useStateTransition.handleConfirm" @cancel="useStateTransition.closeConfirmModal" />

        <svg id="svg-lienzo" ref="svgLienzoRef"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto; z-index: 5;">
            <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.5" />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" stroke-width="1" />
                </pattern>

                <linearGradient id="gradient-azul" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#14b8a6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                </linearGradient>

                <marker id="puntaFlecha" viewBox="0 0 55 55" refX="30" refY="15" markerWidth="12" markerHeight="12"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 30 15 L 0 30 Z" fill="#14b8a6" stroke="#10b981" stroke-width="0.5" />
                </marker>
                <marker id="puntaFlechaPeq" viewBox="0 0 40 40" refX="18" refY="10" markerWidth="8" markerHeight="8"
                    orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 20 10 L 0 20 Z" fill="#14b8a6" stroke="#10b981" stroke-width="0.5" />
                </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
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
            @click="nodosStore.seleccionarNodoParaConexion($event, nodo)"
            @contextmenu.prevent="useStateTransition.editarEstado(nodo)" :data-nodo-id="nodo.id"
            :title="`${nodo.label}${nodo.esInicial ? ' [INICIAL]' : ''}${nodo.esFinal ? ' [FINAL]' : ''}\nClick derecho para editar`">
            <div>{{ nodo.label }}</div>
            <div v-if="nodo.esInicial || nodo.esFinal" class="text-xs mt-1">
                <span v-if="nodo.esInicial" class="text-teal-600 font-bold">●I</span>
                <span v-if="nodo.esFinal" class="text-red-500 font-bold">●F</span>
            </div>
        </div>

        <div v-if="nodosStore.nodos.length > 0" ref="panelTransiciones"
            class="panel-transiciones absolute bottom-5 right-5 w-80 max-h-64 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto z-20 cursor-grab user-select-none hover:shadow-2xl transition scrollbar_styled border border-slate-200"
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
import { onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia';
import ModalEstado from '@/components/ModalEstado.vue';
import ModalTransicion from '@/components/ModalTransicion.vue';
import ModalMessage from '@/components/ModalMessage.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import useModalStore from '@/stores/modal';
import useMenusStore from '@/stores/menus';
import useNodosStore from '@/stores/nodos';
import { useSimuladorStore } from '@/stores/simulador';
import useSimulationAnimatedStore from '@/stores/simulacionAnimada';
import useStateTransitionStore from '@/stores/stateTransition';
import useJsonExportImportStore from '@/stores/jsonExportImport';

const useModal = useModalStore();
const menusStore = useMenusStore();
const { menu, modalVisible } = storeToRefs(menusStore);

const nodosStore = useNodosStore();
const { svgLienzoRef, conexiones, nodos, dragState } = storeToRefs(nodosStore);

const useStateTransition = useStateTransitionStore();
const { panelTransiciones, velocidadAnimacion, estadosVisitados, entradaSimulacion, estadoFormulario, estadoEditandoId, modalTransicionVisible, transicionFormulario } = storeToRefs(useStateTransition);

const simuladorStore = useSimuladorStore();
const simulacionAnimadaStore = useSimulationAnimatedStore();
const jsonExportImport = useJsonExportImportStore();

const limpiarLienzo = () => {
    useStateTransition.openConfirmModal(
        'Confirmar Limpieza de Lienzo',
        '¿Estás seguro que deseas limpiar el lienzo? Esto eliminará todos los estados y conexiones.',
        () => {
            nodosStore.limpiarLienzo();
            simuladorStore.reiniciar();
        }
    );
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