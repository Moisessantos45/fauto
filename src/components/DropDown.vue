<template>
    <div class="w-full relative">
        <button ref="buttonRef" type="button"
            class="w-full bg-slate-50/50 border border-slate-200 rounded-lg flex items-center justify-between px-3 cursor-default h-10 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
            @click="isShow = !isShow" :disabled="disabled">
            <span :class="selectedOption?.name.trim() === '' ? 'text-slate-400' : 'text-slate-700'">
                {{
                    selectedOption?.name.trim() !== ""
                        ? selectedOption.name
                        : "Selecciona un valor"
                }}
            </span>
            <svg class="w-3.5 h-3.5 text-slate-500 transition-transform" :class="{ 'transform rotate-180': isShow }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <teleport to="body">
            <div v-if="isShow" ref="dropdownMenu"
                class="absolute z-50 w-full bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden"
                :style="dropdownStyles">
                <div class="max-h-40 overflow-y-auto">
                    <button v-for="item in list" :key="item.value" type="button"
                        class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-teal-50 focus:bg-teal-100 focus:outline-none transition-colors"
                        :class="{
                            'bg-teal-50 text-teal-700 font-medium': selectedOption?.name === item.name,
                        }" @click="changeValue(item)">
                        {{ item.name }}
                    </button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import type { OptionalField } from "@/types/drop";

const isShow = ref(false);
const option = {
    name: "",
    value: "",
};

const selectedOption = ref<OptionalField>(option);
const dropdownStyles = ref({});
const buttonRef = ref<HTMLElement | null>(null);
const dropdownMenu = ref<HTMLElement | null>(null);

const props = defineProps<{
    list: OptionalField[];
    initialValue?: string;
    disabled?: boolean;
}>();

const emits = defineEmits<{
    (e: "change", value: OptionalField): void;
}>();

const changeValue = (value: OptionalField) => {
    selectedOption.value = value;
    emits("change", value);
    isShow.value = false;
};

watch(isShow, async (val) => {
    if (val) {
        await nextTick();
        const rect = buttonRef.value?.getBoundingClientRect();
        if (rect) {
            dropdownStyles.value = {
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                position: "absolute",
            };
        }
    }
});

onMounted(() => {
    if (props.initialValue) {
        const find = props.list.find(
            (item) => item.value === props.initialValue,
        );
        selectedOption.value = find ? find : option;
    }
});
</script>

<style scoped>
button {
    font-family:
        "Segoe UI",
        system-ui,
        -apple-system,
        sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* Scrollbar estilo moderno */
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