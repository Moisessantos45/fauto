# 🚀 GUÍA VISUAL RÁPIDA - MÁQUINA DE TURING

## Interfaz Principal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────┐                                   │
│  │ TM | Máquina Turing │                                   │
│  ├─────────────────────┤                                   │
│  │                     │                                   │
│  │ ✏️ Edición          │        LIENZO DE SIMULACIÓN      │
│  │ [+ Agregar Estado]  │                                   │
│  │                     │        ╔═════╗                    │
│  │ ▶️ Simulación       │        ║ q0  ║ (Inicial)         │
│  │ [Cadena entrada]    │        ║ (I) ║ ←→ Conexión       │
│  │ [Simular Completo]  │        ╚═════╝                    │
│  │ [Paso a Paso]       │            ↓                      │
│  │ [Reiniciar]         │        ╔═════╗                    │
│  │                     │        ║ q2  ║ (Final)            │
│  │ 📊 Estado Actual    │        ║ (F) ║                    │
│  │ Paso: 3             │        ╚═════╝                    │
│  │ Estado: q1          │                                   │
│  │ Pos: 2              │    📋 Info de Transiciones        │
│  │ Cinta: aabb         │    ┌──────────────────────────┐   │
│  │                     │    │ q0: a→a(R), b→b(R)       │   │
│  │ 🛠️ Utilidades       │    │ q1: b→b(R)               │   │
│  │ [Limpiar]           │    │ q2: (final)              │   │
│  │ [Exportar][Importar]│    └──────────────────────────┘   │
│  │                     │                                   │
│  └─────────────────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Uso (5 Minutos)

### 1️⃣ Crear Estados (Estados)
```
Haz clic: "+ Agregar Estado"
Formulario:
  [Nombre: q0          ]
  [✓ ¿Es inicial?      ]
  [  ¿Es final?        ]
  [Agregar Transición] → Abre modal de transiciones
```

### 2️⃣ Agregar Transiciones
```
Modal de Transición:
  [Lee:    a    ]
  [Escribe:a    ]
  [Movimiento: R]
  [Próximo: q1  ]
  [Agregar]
```

### 3️⃣ Conectar Visualmente (Opcional)
```
Clic en q0 → Clic en q1 → Se dibuja flecha q0→q1
```

### 4️⃣ Simular
```
Input: "aabb"
[Simular Completo] → Resultado automático
```

### 5️⃣ Guardar
```
[Exportar] → Descarga JSON
[Importar] → Carga JSON
```

---

## Estados de Nodo

### 🔵 Estado Inicial
```
  ┌─────┐
  │ q0  │
  │ (I) │  ← Marcado con borde azul y indicador "I"
  └─────┘
```

### 🔴 Estado Final
```
  ┌─────┐
  │ q2  │
  │ (F) │  ← Marcado con borde rojo y indicador "F"
  └─────┘
```

### ⚪ Estado Normal
```
  ┌─────┐
  │ q1  │  ← Borde cyan, sin marcas especiales
  └─────┘
```

---

## Transiciones (Definición)

```
Estado: q0
Transición: Si leo 'a', escribo 'a', me muevo a la derecha, voy a q0

Representación:
  q0 → 'a' / 'a' , R → q0

Símbolo: 'a'     (lo que lees en la cinta)
Acción:  'a'     (lo que escribes)
Movimiento: R    (Derecha = Right, L = Left, S = Stay)
Destino: q0      (próximo estado)
```

---

## Simulación Paso a Paso

```
ENTRADA: "aabb"
ESTADO INICIAL: q0

PASO 1:
  Posición: 0
  Cinta:    [a] [a] [b] [b]
             ↑
  Estado:   q0
  Lee:      'a'
  Acción:   'a' / R → q0
  Resultado: Avanza posición

PASO 2:
  Posición: 1
  Cinta:    [a] [a] [b] [b]
                 ↑
  Estado:   q0
  Lee:      'a'
  Acción:   'a' / R → q0
  Resultado: Avanza posición

PASO 3:
  Posición: 2
  Cinta:    [a] [a] [b] [b]
                     ↑
  Estado:   q0
  Lee:      'b'
  Acción:   'b' / R → q1
  Resultado: Cambia a q1, avanza posición

PASO 4:
  Posición: 3
  Cinta:    [a] [a] [b] [b]
                         ↑
  Estado:   q1
  Lee:      'b'
  Acción:   'b' / R → q1
  Resultado: Sigue en q1, avanza posición

PASO 5:
  Posición: 4 (fuera de la cinta)
  Estado:   q1
  ¿Es FINAL?: Sí
  RESULTADO: ✅ ACEPTADA
```

---

## Casos de Prueba Comunes

### Máquina: Reconoce "a+b+" (uno o más a, uno o más b)

```
ENTRADA          RESULTADO   RAZÓN
─────────────────────────────────────────────────
"ab"             ✅ ACEPTA   Lee a, cambia a q1, lee b
"aabb"           ✅ ACEPTA   Lee aa, cambia a q1, lee bb
"a"              ❌ RECHAZA  No hay transición de b en q1
"b"              ❌ RECHAZA  No hay transición de b en q0
"ba"             ❌ RECHAZA  q0 no tiene transición para b
"aabaa"          ❌ RECHAZA  q1 no tiene transición para a
```

---

## Atajo de Teclado y Gestos

| Acción | Forma |
|--------|-------|
| Crear estado | Click "+ Agregar Estado" |
| Editar estado | Double-click en el nodo |
| Eliminar estado | Right-click (contexto) en el nodo |
| Mover estado | Drag & drop en el nodo |
| Conectar | Click origen + Click destino |
| Mover panel | Drag en el encabezado del panel |
| Paso a paso | Click "⏭ Paso a Paso" |
| Simular completo | Click "▶ Simular Completo" |

---

## Panel de Información

### 📊 Estado Actual (durante simulación)

```
┌──────────────────────────┐
│ Paso: 3                  │  ← Número del paso actual
│ Estado: q1               │  ← Estado donde está
│ Pos. Cabeza: 2           │  ← Posición en la cinta
│ Cinta: aabb              │  ← Contenido de la cinta
└──────────────────────────┘
```

### 📋 Info de Transiciones

```
┌──────────────────────────────┐
│ q0                           │
│ • 'a' → 'a' (R)             │
│ • 'b' → 'b' (R)             │
│                              │
│ q1                           │
│ • 'b' → 'b' (R)             │
│                              │
│ q2                           │
│ Sin transiciones             │
└──────────────────────────────┘
```

---

## Colores y Significado

| Color | Significa |
|-------|-----------|
| 🔵 Azul Fuerte | Elemento importante, inicial |
| 🔷 Cyan | Estados normales, transiciones |
| 🔴 Rojo | Estados finales, eliminar |
| ⚪ Blanco | Fondo, áreas interactivas |
| ⬜ Gris | Deshabilitado, inactivo |

---

## Ejemplo Rápido (60 segundos)

### Máquina que reconoce: "aa"

**PASO 1:** Crear q0
- Nombre: q0, ✓ Inicial

**PASO 2:** Crear q1
- Nombre: q1, ✓ Final

**PASO 3:** Agregar transición q0 → q1
- Lee: a, Escribe: a, Movimiento: R, Destino: q1

**PASO 4:** Simular "aa"
- Input: aa
- Clic: Simular Completo
- Resultado: ✅ ACEPTADA

---

## Problemas y Soluciones

### 🔴 "No hay transición para 'x'"
```
CAUSA:   El estado actual no tiene una transición definida
SOLUCIÓN: Agregar transición faltante
```

### 🔴 "Configuración inválida"
```
CAUSA:   - No hay estado inicial
         - No hay estado final
         - Transición a estado inexistente
SOLUCIÓN: Revisar que todos los requisitos estén cumplidos
```

### 🔴 La máquina se queda en bucle
```
CAUSA:   Hay un ciclo infinito en las transiciones
SOLUCIÓN: Usar "Paso a Paso" para ver dónde se queda
          Revisar transiciones que apunten a sí mismas
```

---

## Acciones del Panel Izquierdo

| Botón | Función |
|-------|---------|
| ✏️ "+ Agregar Estado" | Abre modal para crear nuevo estado |
| ▶️ "Simular Completo" | Ejecuta simulación automática |
| ⏭️ "Paso a Paso" | Un paso de simulación |
| 🔄 "Reiniciar" | Vuelve al inicio o limpia simulación |
| 🗑️ "Limpiar Lienzo" | Elimina TODO (⚠️ IRREVERSIBLE) |
| 📥 "Exportar" | Descarga configuración en JSON |
| 📤 "Importar" | Carga configuración desde archivo |

---

## Ejemplo JSON (Estructura)

```json
{
  "nodos": [
    {
      "id": 1,
      "label": "q0",
      "esInicial": true,
      "esFinal": false,
      "transiciones": [
        {
          "simboloLee": "a",
          "simboloEscribe": "a",
          "movimiento": "R",
          "proximoEstado": 2
        }
      ]
    }
  ],
  "conexiones": [
    {
      "origenId": 1,
      "destinoId": 2,
      "controlPoints": [...]
    }
  ]
}
```

---

¡Listo! Ya estás preparado para usar el simulador. 🎉
