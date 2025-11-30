# 📖 Ejemplo Práctico: Máquina de Turing que Reconoce "aabb"

En este ejemplo, crearemos una Máquina de Turing que acepte cadenas con el patrón: 
- Uno o más 'a' seguidas de uno o más 'b'
- Ejemplos: `ab`, `aab`, `abb`, `aabb`, etc.

---

## 🎯 Objetivo

Crear una máquina que:
1. Lea 'a' mientras los haya
2. Pase a leer 'b'
3. Acepte si lee solo 'b' después de todos los 'a'
4. Rechace si hay caracteres inválidos o falta de transiciones

---

## 📋 Paso 1: Crear los Estados

### Estado 1: q0 (Inicial)
1. Haz clic en **"+ Agregar Estado"**
2. Completa el formulario:
   - **Nombre del Estado:** `q0`
   - ✅ Marca **"¿Es inicial?"**
   - ❌ NO marques "¿Es final?"
3. Haz clic en **"✅ Agregar Estado"**

### Estado 2: q1 (Intermedio)
1. Haz clic en **"+ Agregar Estado"**
2. Completa:
   - **Nombre del Estado:** `q1`
   - ❌ No es inicial
   - ❌ No es final
3. Haz clic en **"✅ Agregar Estado"**

### Estado 3: q2 (Final - Aceptación)
1. Haz clic en **"+ Agregar Estado"**
2. Completa:
   - **Nombre del Estado:** `q2`
   - ❌ No es inicial
   - ✅ Marca **"¿Es final?"**
3. Haz clic en **"✅ Agregar Estado"**

---

## ⚙️ Paso 2: Agregar Transiciones a q0

El estado q0 debe:
- Leer 'a' y escribir 'a' (sin cambiar)
- Moverse a la derecha
- Permanecer en q0 (mientras haya 'a')

### Editar q0 para agregar transiciones:
1. Haz **clic derecho** en el estado **q0** para editarlo
2. Haz clic en **"+ Agregar Transición"**

**Primera Transición (leer 'a', quedarse en q0):**
- **Lee:** `a`
- **Escribe:** `a`
- **Movimiento:** Derecha (R)
- **Próximo Estado:** q0
- ✅ Agregar

**Segunda Transición (leer 'b', ir a q1):**
- Haz clic **"+ Agregar Transición"** de nuevo
- **Lee:** `b`
- **Escribe:** `b`
- **Movimiento:** Derecha (R)
- **Próximo Estado:** q1
- ✅ Agregar

3. Finalmente haz clic **"✅ Guardar"** para guardar q0 con ambas transiciones

---

## ⚙️ Paso 3: Agregar Transiciones a q1

El estado q1 debe:
- Leer 'b' y escribir 'b'
- Moverse a la derecha
- Permanecer en q1 (mientras haya 'b')
- **Al leer blanco (fin de cadena), ir a q2 (aceptar)**

### Editar q1 para agregar transiciones:
1. Haz **clic derecho** en el estado **q1** para editarlo
2. Haz clic en **"+ Agregar Transición"**

**Primera Transición (leer 'b', quedarse en q1):**
- **Lee:** `b`
- **Escribe:** `b`
- **Movimiento:** Derecha (R)
- **Próximo Estado:** q1
- ✅ Agregar

**Segunda Transición (leer blanco '_', ir a q2 - ACEPTAR):**
- Haz clic **"+ Agregar Transición"** de nuevo
- **Lee:** `_` (guión bajo = símbolo blanco/fin de cinta)
- **Escribe:** `_`
- **Movimiento:** Se queda (S)
- **Próximo Estado:** q2
- ✅ Agregar

3. Haz clic **"✅ Guardar"** para guardar q1

---

## 📊 Paso 4: Conexiones Visuales (Automáticas)

Las conexiones visuales (flechas) se crean **automáticamente** cuando agregas transiciones. 

Al guardar los estados con sus transiciones, verás:
- Una flecha de **q0 a q0** (self-loop para leer 'a')
- Una flecha de **q0 a q1** (cuando lee 'b')
- Una flecha de **q1 a q1** (self-loop para leer 'b')
- Una flecha de **q1 a q2** (cuando lee blanco, acepta)

> **Nota:** Si quieres crear conexiones adicionales manualmente:
> 1. Haz clic en el estado origen
> 2. Haz clic en el estado destino
> Para crear un self-loop, haz clic dos veces en el mismo estado.

---

## ▶️ Paso 5: Simular

### Prueba 1: Entrada `ab` (Debe Aceptar) ✅

1. En el campo **"Cadena de Entrada"** escribe: `ab`
2. Haz clic en **"▶ Simular Completo"**
3. Observa en el panel derecho:
   - **Paso 1:** Estado q0, Lee 'a', escribe 'a', mueve a derecha
   - **Paso 2:** Estado q1, Lee 'b', escribe 'b', mueve a derecha
   - **Paso 3:** Llega a q2 (FINAL) → ✅ ACEPTADA

### Prueba 2: Entrada `aabb` (Debe Aceptar) ✅

1. Limpia y escribe: `aabb`
2. Haz clic en **"▶ Simular Completo"**
3. Espera a ver el resultado de aceptación

### Prueba 3: Entrada `aaa` (Debe Rechazar) ❌

1. Limpia y escribe: `aaa`
2. Haz clic en **"▶ Simular Completo"**
3. La máquina no encontrará transición válida y rechazará

### Prueba 4: Entrada `ab` Paso a Paso (Interactivo)

1. Limpia y escribe: `ab`
2. Haz clic en **"🔄 Reiniciar"** primero
3. Ahora haz clic en **"⏭ Paso a Paso"** repetidamente
4. Observa cómo:
   - Se mueve de q0 → q1 cuando lee 'b'
   - Se llega a q2 (final)
   - El panel muestra cada paso

---

## 🔍 Visualización del Panel de Información

Mientras simulas, el panel derecho muestra:

```
📊 Estado Actual
Paso: 3
Estado: q2
Pos. Cabeza: 2
Cinta: ab
```

Esto significa:
- Estás en el paso 3
- Estado actual es q2 (final)
- La cabeza está en posición 2 (después de leer todo)
- La cinta contiene: ab

---

## 📥 Paso 6: Guardar tu Máquina

1. Haz clic en **"📥 Exportar"**
2. Se descargará un archivo `maquina-turing.json`
3. Este archivo contiene toda tu configuración

### Para cargar después:
1. Haz clic en **"📤 Importar"**
2. Selecciona tu archivo `.json`
3. ¡Tu máquina se cargará automáticamente!

---

## 🧠 Explicación Técnica

### Tabla de Transiciones

| Estado | Lee | Escribe | Movimiento | Próximo Estado |
|--------|-----|---------|------------|----------------|
| q0     | a   | a       | Derecha (R)| q0             |
| q0     | b   | b       | Derecha (R)| q1             |
| q1     | b   | b       | Derecha (R)| q1             |
| q1     | _   | _       | Se queda (S)| q2 (FINAL)    |

> **Nota:** El símbolo `_` representa el blanco (fin de la cinta)

### Procesamiento de "aabb"

```
Inicio:
Posición: 0
Cinta: [a][a][b][b][_]
Estado: q0

Paso 1: Lee 'a' → Escribe 'a' → Derecha → Nuevo estado: q0
Posición: 1
Cinta: [a][a][b][b][_]
          ^

Paso 2: Lee 'a' → Escribe 'a' → Derecha → Nuevo estado: q0
Posición: 2
Cinta: [a][a][b][b][_]
             ^

Paso 3: Lee 'b' → Escribe 'b' → Derecha → Nuevo estado: q1
Posición: 3
Cinta: [a][a][b][b][_]
                ^

Paso 4: Lee 'b' → Escribe 'b' → Derecha → Nuevo estado: q1
Posición: 4
Cinta: [a][a][b][b][_]
                   ^

Paso 5: Lee '_' (blanco) → Escribe '_' → Se queda → Nuevo estado: q2
Estado q2 es FINAL → ✅ ACEPTADA
```

---

## 🐛 Problemas Comunes y Soluciones

### "No hay transición para 'a'"
- Significa que falta una transición en el estado actual
- Verifica que hayas agregado todas las transiciones necesarias
- Revisa el panel "📋 Info de Transiciones"

### La máquina se queda en bucle infinito
- Haz clic en **"🔄 Reiniciar"**
- Revisa tus transiciones, probablemente hay un ciclo infinito
- Usa "⏭ Paso a Paso" para verificar

### No puedo agregar transiciones
- Primero debes tener al menos 2 estados creados
- Abre el modal de estado y luego "✅ Agregar Estado"

---

## ✨ Ejemplo Alternativo: Máquina que Reconoce "0*1+"

Si quieres intentar otro patrón (cero o más '0' seguidos de uno o más '1'):

**Estados:**
- q0 (Inicial)
- q1 (Intermedio - leyendo 1s)
- q2 (Final)

**Transiciones:**
| Estado | Lee | Escribe | Movimiento | Próximo Estado |
|--------|-----|---------|------------|----------------|
| q0     | 0   | 0       | Derecha (R)| q0             |
| q0     | 1   | 1       | Derecha (R)| q1             |
| q1     | 1   | 1       | Derecha (R)| q1             |
| q1     | _   | _       | Se queda (S)| q2 (FINAL)    |

**Pruebas:**
- `0011` ✅ ACEPTADA (ceros seguidos de unos, termina en blanco → q2)
- `011` ✅ ACEPTADA
- `01` ✅ ACEPTADA
- `1` ✅ ACEPTADA (solo unos también es válido)
- `00` ❌ RECHAZADA (no tiene unos, no hay transición para '_' desde q0)
- `111` ✅ ACEPTADA

---

## ✨ Ejemplo Avanzado: Máquina que Reconoce B = {w#w | w ∈ {0,1}*}

Esta máquina reconoce cadenas de la forma `w#w`, donde `w` es cualquier combinación de 0s y 1s. La cadena antes del `#` debe ser idéntica a la cadena después del `#`.

**Ejemplos válidos:** `0#0`, `1#1`, `01#01`, `101#101`, `#` (cadena vacía)

**Ejemplos inválidos:** `0#1`, `01#10`, `00#0`

### Estados:
- **q1** (Inicial) - Marca el primer símbolo
- **q2** - Busca el # (leyó un 0)
- **q3** - Busca el # (leyó un 1)
- **q4** - Busca el 0 correspondiente después del #
- **q5** - Busca el 1 correspondiente después del #
- **q6** - Regresa al inicio
- **q7** - Regresa buscando x
- **q8** - Verifica que no queden símbolos
- **q9** (Final) - Aceptación

### Tabla de Transiciones

| Estado | Lee | Escribe | Movimiento | Próximo Estado |
|--------|-----|---------|------------|----------------|
| q1     | 0   | x       | R          | q2             |
| q1     | 1   | x       | R          | q3             |
| q1     | #   | #       | R          | q8             |
| q2     | 0   | 0       | R          | q2             |
| q2     | 1   | 1       | R          | q2             |
| q2     | #   | #       | R          | q4             |
| q3     | 0   | 0       | R          | q3             |
| q3     | 1   | 1       | R          | q3             |
| q3     | #   | #       | R          | q5             |
| q4     | x   | x       | R          | q4             |
| q4     | 0   | x       | L          | q6             |
| q5     | x   | x       | R          | q5             |
| q5     | 1   | x       | L          | q6             |
| q6     | 0   | 0       | L          | q6             |
| q6     | 1   | 1       | L          | q6             |
| q6     | x   | x       | L          | q6             |
| q6     | #   | #       | L          | q7             |
| q7     | 0   | 0       | L          | q7             |
| q7     | 1   | 1       | L          | q7             |
| q7     | x   | x       | R          | q1             |
| q8     | x   | x       | R          | q8             |
| q8     | _   | _       | R          | q9 (FINAL)     |

### Funcionamiento:

1. **q1**: Marca el primer símbolo de la primera mitad con `x`, recuerda si era 0 (va a q2) o 1 (va a q3)
2. **q2/q3**: Avanza hasta encontrar el `#`
3. **q4/q5**: Busca el símbolo correspondiente en la segunda mitad y lo marca con `x`
4. **q6**: Regresa hacia la izquierda pasando por 0, 1, x hasta encontrar `#`
5. **q7**: Continúa hacia la izquierda hasta encontrar la `x` que marca dónde empezar
6. **q1**: Repite el proceso con el siguiente símbolo
7. **q8**: Cuando q1 lee `#`, significa que terminó la primera mitad, verifica que solo queden `x` y blanco
8. **q9**: Si todo coincide, acepta

### Pruebas:
- `0#0` ✅ ACEPTADA
- `1#1` ✅ ACEPTADA
- `01#01` ✅ ACEPTADA
- `101#101` ✅ ACEPTADA
- `#` ✅ ACEPTADA (cadena vacía w)
- `0#1` ❌ RECHAZADA
- `01#10` ❌ RECHAZADA
- `00#0` ❌ RECHAZADA

---

¡Ahora ya sabes cómo usar el simulador! 🚀

Próximos pasos: Intenta crear máquinas más complejas y experimenta con diferentes patrones.
