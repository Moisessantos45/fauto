<template>
    <dialog id="add-node-dialog-nfa" :class="[
        'flex-col absolute p-6 bg-white backdrop-blur-md rounded-2xl shadow-2xl overflow-y-auto z-30 cursor-auto user-select-auto gap-4 top-1/4 left-1/4 w-[35%]',
        visible ? 'flex' : 'hidden'
    ]">
        <div class="border-b border-slate-100 pb-4 mb-2">
            <h3 class="text-2xl font-bold text-slate-800">
                {{ esEdicion ? 'Editar Estado' : 'Agregar Estado' }}
            </h3>
        </div>

        <div class="space-y-4">
            <div>
                <label for="estado-nombre-nfa" class="text-sm font-medium text-slate-700 block mb-1">
                    Nombre del Estado:
                </label>
                <input type="text" v-model="formulario.nombre" id="estado-nombre-nfa" name="estado-nombre-nfa"
                    placeholder="q0, q1, q2..."
                    class="border border-slate-200 rounded-lg p-3 w-full text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 bg-slate-50/50 transition" />
            </div>

            <div class="flex gap-6">
                <label
                    class="flex items-center gap-3 cursor-pointer hover:bg-orange-50 p-2 rounded-lg flex-1 transition">
                    <input type="checkbox" v-model="formulario.esInicial" class="w-5 h-5 accent-orange-500">
                    <span class="text-sm font-medium text-slate-700">Inicial</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded-lg flex-1 transition">
                    <input type="checkbox" v-model="formulario.esFinal" class="w-5 h-5 accent-red-500">
                    <span class="text-sm font-medium text-slate-700">Final</span>
                </label>
            </div>
        </div>

        <div class="border-t border-slate-100 pt-4">
            <h4 class="font-semibold text-sm text-slate-700 mb-3">Transiciones NFA</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto bg-slate-50/70 p-3 rounded-lg">
                <div v-if="formulario.transicionesNFA.length === 0" class="text-center text-slate-400 text-xs py-4">
                    Sin transiciones definidas
                </div>
                <div v-for="(trans, idx) in formulario.transicionesNFA" :key="idx"
                    class="bg-white p-2.5 rounded-lg text-xs flex justify-between items-center shadow-sm">
                    <span class="font-mono text-slate-600">
                        <span :class="trans.simbolo === 'ε' ? 'text-orange-500 font-bold' : ''">
                            '{{ trans.simbolo }}'
                        </span> → {{ obtenerLabelEstado(trans.proximoEstado) }}
                    </span>
                    <button @click="formulario.transicionesNFA.splice(idx, 1)"
                        class="text-red-400 hover:text-red-600 font-bold ml-2 text-lg transition">✕</button>
                </div>
            </div>
            <button @click="$emit('openTransicion')"
                class="w-full mt-3 bg-orange-50 text-orange-700 px-3 py-2.5 rounded-lg font-semibold hover:bg-orange-100 transition text-sm">
                Agregar Transición
            </button>
        </div>

        <div class="w-full flex justify-between gap-3 mt-6 border-t border-slate-100 pt-4">
            <button v-if="esEdicion" type="button" @click="$emit('delete')"
                class="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition cursor-pointer text-sm">
                Eliminar
            </button>
            <div class="flex gap-3 ml-auto">
                <button type="button" @click="$emit('close')"
                    class="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm">
                    Cancelar
                </button>
                <button type="submit" @click="$emit('submit')"
                    class="bg-orange-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-orange-600 hover:shadow-md transition cursor-pointer text-sm"
                    id="add-node-btn-nfa">{{ esEdicion ? 'Guardar' : 'Agregar' }}</button>
            </div>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Nodo, TransicionNFA } from '@/types/nodo';

interface EstadoFormularioNFA {
    nombre: string;
    esInicial: boolean;
    esFinal: boolean;
    transicionesNFA: TransicionNFA[];
}

const props = defineProps<{
    visible: boolean;
    formulario: EstadoFormularioNFA;
    editandoId: number | null;
    nodos: Nodo[];
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'submit'): void;
    (e: 'openTransicion'): void;
    (e: 'delete'): void;
}>();

const esEdicion = computed(() => props.editandoId !== null);

const obtenerLabelEstado = (id: number): string => {
    const nodo = props.nodos.find(n => n.id === id);
    return nodo ? nodo.label : `Estado ${id}`;
};
</script>
