# ❓ Preguntas Frecuentes (FAQ)

## General

### ¿Qué es una Máquina de Turing?
Una Máquina de Turing es un modelo teórico de computación. Consiste en:
- Una **cinta infinita** con símbolos
- Una **cabeza lectora/escritora** que se mueve
- Un **conjunto de estados** que controlan el comportamiento
- **Transiciones** que definen qué hacer en cada paso

Es el modelo más potente de computación, capaz de resolver cualquier problema que sea algorítmicamente resoluble.

### ¿Para qué sirve este simulador?
Para:
- **Aprender** teoría de autómatas y máquinas de Turing
- **Diseñar** máquinas de Turing visualmente
- **Simular** el comportamiento de tus máquinas
- **Verificar** que funcionan correctamente
- **Exportar/Importar** configuraciones

### ¿Puedo usar esto para mis tareas universitarias?
Sí, es una herramienta educativa perfecta para:
- Trabajos de autómatas
- Teoría de la computación
- Compiladores y lenguajes formales
- Investigación en computabilidad

---

## Uso Básico

### ¿Cómo creo un estado?
1. Haz clic en **"+ Agregar Estado"**
2. Ingresa el nombre (ej: q0, q1, q2)
3. Marca si es **inicial** o **final**
4. Haz clic en **"✅ Agregar Estado"**

### ¿Cuántos estados puedo crear?
Teóricamente ilimitados, pero 5-10 es lo común para máquinas simples.

### ¿Qué es una transición?
Es una regla que dice: "Si estoy en estado X y leo símbolo A, escribo B, me muevo en dirección D, y voy al estado Y"

Ejemplo: Si estoy en q0 y leo 'a', escribo 'a', me muevo derecha, voy a q1

### ¿Qué diferencia hay entre L, R y S?
- **L (Left/Izquierda)**: La cabeza se mueve a la celda anterior
- **R (Right/Derecha)**: La cabeza se mueve a la celda siguiente
- **S (Stay/Se queda)**: La cabeza permanece en la misma celda

### ¿Puedo editar un estado después de crearlo?
Sí, haz **double-click** en el estado para editarlo.

### ¿Cómo elimino un estado?
Haz **right-click (clic derecho)** en el estado y se abrirá un menú contextual.

### ¿Qué es el estado inicial?
Es el estado donde comienza la máquina. Solo puede haber uno.
Se marca con un borde **azul fuerte** y un indicador **"●I"**

### ¿Qué es un estado final?
Es un estado de aceptación. Si la máquina termina aquí, la entrada es **aceptada**.
Se marca con un borde **rojo** y un indicador **"●F"**

---

## Simulación

### ¿Qué pasa en cada simulación?
1. Comienza en el estado inicial
2. Lee el símbolo en la posición actual
3. Busca una transición que coincida
4. Si existe: ejecuta (escribe, mueve, cambia estado)
5. Si no existe: **rechaza la entrada**
6. Si llega a un estado final: **acepta la entrada**

### ¿Cuál es la diferencia entre "Simular Completo" y "Paso a Paso"?
- **Simular Completo**: La máquina corre automáticamente hasta el final
- **Paso a Paso**: Cada clic ejecuta un paso, puedes pausar y observar

### ¿Por qué mi simulación se queda en bucle?
Posibles causas:
- Hay una transición que apunta a sí misma infinitamente
- No hay una condición para salir del ciclo

Solución: Usa "Paso a Paso" para ver dónde se queda

### ¿Qué significa "No hay transición para 'a'"?
Significa que en el estado actual, no existe una transición para el símbolo 'a'.
Necesitas agregar una transición que maneje este símbolo.

### ¿Puedo simular cadenas vacías?
Sí, déjalo vacío o presiona enter. La máquina comenzará con la cinta en blanco.

### ¿Qué es la posición de la cabeza?
Es el índice (posición) actual en la cinta.
- Posición 0: primer carácter
- Posición 1: segundo carácter
- etc.

---

## Estados y Transiciones

### ¿Puedo conectar un estado a sí mismo?
Sí, se llama un "self-loop" o "bucle de retroalimentación".
Ejemplo: q0 → 'a' → q0 (mientras haya 'a', quédate en q0)

### ¿Qué pasa si no defino ninguna transición?
El estado es una "trampa" (trap state). Si la máquina llega ahí sin tener más transiciones, rechaza.

### ¿Necesito conectar visualmente los estados?
No es obligatorio. Las conexiones visuales son solo para entender mejor.
Las transiciones se definen en el modal de cada estado.

### ¿Puedo tener múltiples transiciones con el mismo símbolo?
No. Una transición es única por símbolo en cada estado.
Si lo intentas, sobrescribirá la anterior.

### ¿Qué es un símbolo?
Es un carácter individual: 'a', 'b', '0', '1', 'X', '_', etc.
Generalmente son caracteres simples, no cadenas.

### ¿Puede la máquina escribir símbolos diferentes?
Sí. Por ejemplo: Lee '1', escribe 'X', así modificas la cinta.

---

## Visualización

### ¿Cómo muevo los estados en el lienzo?
Haz **drag & drop** (arrastra) en cualquier parte del nodo.

### ¿Cómo muevo el panel de control?
Haz drag en el **encabezado** del panel (donde dice "TM | Máquina de Turing").

### ¿Cómo ajusto las conexiones?
Haz clic en la línea de conexión. Aparecerán puntos de control.
Arrastra los puntos para curvar la línea.

### ¿Puedo cambiar los colores?
Actualmente no, pero está pensado para una versión futura.
Los colores son: Azul (inicial), Cyan (normal), Rojo (final).

### ¿Qué significan los números en los puntos?
Los números son IDs internos de los puntos de control. Puedes ignorarlos.

---

## Importar/Exportar

### ¿Qué es un archivo JSON?
Es un formato de texto estructurado que contiene tu máquina.
Puedes compartirlo, guardarlo, o cargarlo después.

### ¿Cómo exporto mi máquina?
1. Haz clic en **"📥 Exportar"**
2. Se descargará un archivo `.json`
3. Guárdalo en tu computadora

### ¿Cómo cargo una máquina guardada?
1. Haz clic en **"📤 Importar"**
2. Selecciona el archivo `.json`
3. Tu máquina se cargará automáticamente

### ¿Qué pasa si cargo un JSON incorrecto?
Verás un error. El archivo debe tener la estructura correcta.

### ¿Puedo compartir archivos JSON con compañeros?
Sí, completamente. Es un formato estándar.

### ¿Dónde se guardan las máquinas por defecto?
Las máquinas se guardan en la memoria del navegador.
Si limpias los datos del navegador, se pierden.
Por eso es importante exportar antes.

---

## Errores Comunes

### ❌ "Configuración inválida"
**Causas posibles:**
- No hay estado inicial
- No hay estado final
- Una transición apunta a un estado que no existe

**Solución:**
- Crea al menos 2 estados
- Marca uno como inicial y otro como final
- Verifica que todas las transiciones apunten a estados válidos

### ❌ "No hay transición para 'a'"
**Causa:** El estado actual no tiene definida una transición para ese símbolo

**Solución:** Agrega la transición faltante

### ❌ La máquina se queda corriendo infinitamente
**Causa:** Hay un ciclo sin salida

**Solución:**
- Usa "Paso a Paso" para ver dónde se queda
- Verifica si necesitas una condición de salida diferente

### ❌ No aparecen las transiciones
**Causa:** Probablemente no agregaste ninguna

**Solución:** En el modal de estado, haz clic en "+ Agregar Transición"

### ❌ El navegador se ralentiza
**Causa:** Demasiados pasos de simulación (posible bucle infinito)

**Solución:**
- El simulador tiene límite de 10,000 pasos por seguridad
- Si llega al límite, detiene automáticamente

---

## Ejemplos Rápidos

### Máquina que reconoce "a"
```
q0 (inicial) →[a/a,R]→ q1 (final)
```
- Entrada "a" → ✅ ACEPTA
- Entrada "aa" → ❌ RECHAZA
- Entrada "b" → ❌ RECHAZA

### Máquina que reconoce "a+"
```
q0 (inicial) →[a/a,R]→ q0
q0 →[_/_,S]→ q1 (final)
```
- Entrada "a" → ✅ ACEPTA
- Entrada "aaa" → ✅ ACEPTA
- Entrada "" → ❌ RECHAZA

### Máquina que reconoce "0*1*"
```
q0 (inicial) →[0/0,R]→ q0
q0 →[1/1,R]→ q1
q1 →[1/1,R]→ q1
q1 →[_/_,S]→ q2 (final)
```
- Entrada "0011" → ✅ ACEPTA
- Entrada "01" → ✅ ACEPTA
- Entrada "110" → ❌ RECHAZA

---

## Datos Técnicos

### ¿Cuál es el límite de caracteres en la cinta?
Teoréticamente ilimitado, pero limitado por la memoria del navegador.
Típicamente puedes trabajar con 1000+ caracteres sin problemas.

### ¿Cuál es el límite de pasos?
Por seguridad: 10,000 pasos máximo.
Si la máquina no termina en ese tiempo, se detiene.

### ¿Qué velocidad tiene la simulación automática?
Por defecto 500ms entre pasos.
Puedes cambiarla modificando `velocidadSimulacion` en el código.

### ¿Es compatible con otros simuladores?
El formato JSON es estándar, pero puede que no sea compatible con otros simuladores sin conversión.

---

## Mejoras Futuras

Características que podrían agregarse:
- [ ] Cambiar colores personalizados
- [ ] Historial de simulaciones
- [ ] Depurador visual (breakpoints)
- [ ] Exportar a PNG/SVG
- [ ] Soporte para múltiples cintas
- [ ] Compartir máquinas online
- [ ] Biblioteca de máquinas comunes
- [ ] Pruebas automáticas

---

¿No encontraste tu pregunta? 
Consulta la documentación completa en `TUTORIAL_TURING.md` o `GUIA_VISUAL_RAPIDA.md`
