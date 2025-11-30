<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('Simulators')

const simulators = [
  {
    id: 'dfa',
    name: 'DFA Simulator',
    acronym: 'DFA',
    description: 'Deterministic Finite Automaton simulator for creating and testing finite state machines.',
    color: 'from-green-600 to-emerald-500',
    borderColor: 'border-t-4 border-emerald-500',
    bgCard: 'bg-green-50',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    link: '/dfa-simulator'
  },
  {
    id: 'fsm',
    name: 'Moore/Mealy Machine',
    acronym: 'FSM',
    description: 'Moore/Mealy Machine simulator for creating and testing finite state machines with outputs.',
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-t-4 border-amber-500',
    bgCard: 'bg-yellow-50',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    link: '/fsm-simulator'
  },
  {
    id: 'nfa',
    name: 'NFA Simulator',
    acronym: 'NFA',
    description: 'Non-deterministic Finite Automaton simulator with support for epsilon transitions.',
    color: 'from-purple-600 to-violet-500',
    borderColor: 'border-t-4 border-purple-600',
    bgCard: 'bg-purple-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    link: '/nfa-simulator'
  },
  {
    id: 'pda',
    name: 'PDA Simulator',
    acronym: 'PDA',
    description: 'Pushdown Automaton simulator with stack operations for context-free languages.',
    color: 'from-orange-600 to-red-500',
    borderColor: 'border-t-4 border-orange-600',
    bgCard: 'bg-orange-50',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    link: '/pda-simulator'
  },
  {
    id: 'tm',
    name: 'TM Simulator',
    acronym: 'TM',
    description: 'Turing Machine simulator with tape manipulation for the most powerful computation model.',
    color: 'from-blue-600 to-cyan-500',
    borderColor: 'border-t-4 border-blue-600',
    bgCard: 'bg-blue-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    link: '/tm-simulator'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient from-slate-50 to-slate-100">
    <section class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
      <div class="text-center">
        <h2 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Explore <span class="text-teal-500">Automata</span> Simulators
        </h2>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
          Interact with powerful simulation tools for various types of automata. Design, test, and visualize
          computational models.
        </p>

        <div class="flex justify-center gap-4 mb-16">
          <button @click="activeTab = 'Simulators'" :class="[
            'px-8 py-3 rounded-lg font-medium transition',
            activeTab === 'Simulators'
              ? 'bg-teal-500 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          ]">
            Simulators
          </button>
          <button @click="activeTab = 'Examples'" :class="[
            'px-8 py-3 rounded-lg font-medium transition',
            activeTab === 'Examples'
              ? 'bg-teal-500 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          ]">
            Examples
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto">
        <div v-for="simulator in simulators" :key="simulator.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
          <div :class="`h-1 bg-linear-to-r ${simulator.color}`"></div>

          <div class="p-8">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${simulator.color} bg-linear-to-r`">
                {{ simulator.acronym }}
              </div>
              <div class="flex flex-col">
                <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ simulator.name }}</h3>
                <p class="text-sm font-medium text-slate-500 mb-4">{{ simulator.acronym }}</p>
              </div>
            </div>

            <p class="text-slate-600 text-sm leading-relaxed mb-8">
              {{ simulator.description }}
            </p>

            <router-link :to="simulator.link">

              <button :class="`w-full ${simulator.buttonColor} text-white py-3 rounded-lg font-semibold transition`">
                Open Simulator
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-slate-900 text-slate-300 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <p>&copy; 2025 AutomataVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
