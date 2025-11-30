<template>
    <dialog :class="[
        'flex-col absolute p-6 bg-white backdrop-blur-md rounded-2xl shadow-2xl overflow-y-auto z-40 gap-4 top-1/3 left-1/3 w-1/3',
        visible ? 'flex' : 'hidden'
    ]">
        <div class="border-b border-slate-100 pb-4 mb-2">
            <h3 class="text-lg font-bold text-slate-800">⚙️ Agregar Transición</h3>
        </div>

        <div class="space-y-3 text-sm">
            <div>
                <label class="font-medium text-slate-700 block mb-1">Lee (símbolo actual):</label>
                <input type="text" v-model="formulario.simboloLee" maxlength="1"
                    class="border border-slate-200 rounded-lg p-2.5 w-full focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 bg-slate-50/50 transition">
            </div>
            <div>
                <label class="font-medium text-slate-700 block mb-1">Escribe (nuevo símbolo):</label>
                <input type="text" v-model="formulario.simboloEscribe" maxlength="1"
                    class="border border-slate-200 rounded-lg p-2.5 w-full focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 bg-slate-50/50 transition">
            </div>
            <div>
                <label class="font-medium text-slate-700 block mb-1">Movimiento del cabezal:</label>
                <DropDown :list="opcionesMovimiento" :initial-value="formulario.movimiento"
                    @change="(val) => formulario.movimiento = val.value as 'L' | 'R' | 'S'" />
            </div>
            <div>
                <label class="font-medium text-slate-700 block mb-1">Próximo Estado:</label>
                <DropDown :list="opcionesNodos" :initial-value="formulario.proximoEstado"
                    @change="(val) => formulario.proximoEstado = val.value" />
            </div>
        </div>

        <div class="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
            <button @click="$emit('close')"
                class="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 text-sm transition">
                ❌ Cancelar
            </button>
            <button @click="$emit('submit')"
                class="bg-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-600 hover:shadow-md text-sm transition">
                ✅ Agregar
            </button>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import DropDown from './DropDown.vue';
import type { OptionalField } from '@/types/drop';
import type { Nodo } from '@/types/nodo';

interface TransicionFormulario {
    simboloLee: string;
    simboloEscribe: string;
    movimiento: 'L' | 'R' | 'S';
    proximoEstado: string;
}

const props = defineProps<{
    visible: boolean;
    formulario: TransicionFormulario;
    nodos: Nodo[];
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'submit'): void;
}>();

const opcionesMovimiento: OptionalField[] = [
    { name: '⬅️ Izquierda (L)', value: 'L' },
    { name: '➡️ Derecha (R)', value: 'R' },
    { name: '⏸️ No mover (S)', value: 'S' },
];

const opcionesNodos = computed<OptionalField[]>(() => {
    return props.nodos.map(nodo => ({
        name: nodo.label,
        value: String(nodo.id)
    }));
});
</script>
