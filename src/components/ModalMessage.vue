<template>
    <dialog id="message-dialog" :class="[
        'flex-col absolute p-6 bg-white backdrop-blur-md rounded-2xl shadow-2xl overflow-y-auto z-30 cursor-auto user-select-auto gap-4 top-1/4 left-1/4 w-[35%]',
        visible ? 'flex' : 'hidden'
    ]">
        <div class="border-b border-slate-100 pb-4 mb-2">
            <h3 class="text-2xl font-bold text-slate-800">
                {{ title }}
            </h3>
        </div>

        <div class="space-y-4">
            <p class="text-sm text-slate-700">{{ message }}</p>
        </div>

        <div class="w-full flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
            <button type="button" @click="$emit('close')"
                class="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition cursor-pointer text-sm">
                Cerrar
            </button>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
defineProps<{
    visible: boolean;
    title: string;
    message: string;
}>();

defineEmits<{
    (e: 'close'): void;
}>();
</script>
