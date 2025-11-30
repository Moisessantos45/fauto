<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
    <header class="bg-white shadow-sm fixed top-0 w-full z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div
                    class="w-10 h-10 bg-gradient from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-lg font-bold">A</span>
                </div>
                <RouterLink to="/">
                    <h1 class="text-2xl font-bold text-slate-900">F<span class="text-teal-500">Auto</span></h1>
                </RouterLink>
            </div>
            <nav class="hidden md:flex gap-8 items-center">
                <a href="#" class="text-slate-600 hover:text-slate-900 text-sm font-medium">Simulators</a>
                <a href="#" class="text-slate-600 hover:text-slate-900 text-sm font-medium">Learn</a>
                <a href="#" class="text-slate-600 hover:text-slate-900 text-sm font-medium">Demo</a>
                <a href="#" class="text-slate-600 hover:text-slate-900 text-sm font-medium">About</a>
                <a href="#" class="text-slate-600 hover:text-slate-900 text-sm font-medium">Features</a>
                <button
                    class="border-2 border-teal-500 text-teal-500 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition">Sign
                    Up</button>
                <button
                    class="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition">Login</button>
            </nav>
            <button class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center md:hidden">
                <span class="text-slate-600">☰</span>
            </button>
        </div>
    </header>
</template>