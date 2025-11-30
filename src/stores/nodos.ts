import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type {
  Conexion,
  Nodo,
  Punto,
  PuntoControlMovimiento,
  Transicion,
} from "@/types/nodo";

const useNodosStore = defineStore("nodos", () => {
  const svgLienzoRef = ref<SVGSVGElement | null>(null);

  const nodos = ref<Nodo[]>([]);

  const conexiones = ref<Map<string, Conexion>>(new Map());
  const connectionCounter = ref(0);

  const dragState = reactive({
    offsetX: 0,
    offsetY: 0,
    offsetXControl: 0,
    offsetYControl: 0,
    nodoEnMovimiento: null as Nodo | null,
    puntoControlEnMovimiento: null as PuntoControlMovimiento | null,
    huboMovimiento: false,
    huboMovimientoControl: false,
    clickEnLinea: false,
    nodoSeleccionado: null as Nodo | null,
  });

  const obtenerPosicionSVG = (
    elemento: HTMLElement,
    svgRect: DOMRect
  ): Punto => {
    const rect = elemento.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - svgRect.left,
      y: rect.top + rect.height / 2 - svgRect.top,
    };
  };

  const crearObtenerElementoSVG = (
    id: string,
    tipo: string,
    atributos: Record<string, any> = {}
  ): SVGElement => {
    let elemento = document.getElementById(id) as SVGElement | null;

    if (!elemento && svgLienzoRef.value) {
      elemento = document.createElementNS(
        "http://www.w3.org/2000/svg",
        tipo
      ) as SVGElement;
      elemento.setAttribute("id", id);
      svgLienzoRef.value.appendChild(elemento);
    }

    if (elemento) {
      Object.entries(atributos).forEach(([key, value]) => {
        if (key === "cursor" && elemento) {
          (elemento as unknown as HTMLElement).style.cursor = value;
        } else if (key !== "cursor") {
          elemento?.setAttribute(key, value);
        }
      });
    }

    return elemento!;
  };

  const dibujarLineaAuxiliar = (
    grupo: SVGGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): void => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", "lightgray");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "5,5");
    grupo.appendChild(line);
  };

  const crearCirculoControl = (
    grupo: SVGGElement,
    x: number,
    y: number,
    connectionId: string,
    index: number,
    color: string = "green",
    esElimible: boolean = false
  ): void => {
    const circulo = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circulo.setAttribute("cx", x.toString());
    circulo.setAttribute("cy", y.toString());
    circulo.setAttribute("r", "6");
    circulo.setAttribute("fill", color);
    circulo.setAttribute("class", "control-point");
    circulo.setAttribute("data-connection", connectionId);
    circulo.setAttribute("data-point", index.toString());
    circulo.style.cursor = "grab";
    circulo.addEventListener("mousedown", (e: MouseEvent) =>
      iniciarMovimientoControl(e)
    );

    if (esElimible) {
      circulo.addEventListener("dblclick", (e: MouseEvent) =>
        eliminarPuntoControl(e, connectionId, index)
      );
    }

    grupo.appendChild(circulo);
  };

  const dibujarOActualizarConexion = (
    origen: HTMLElement,
    destino: HTMLElement,
    connectionId: string
  ): SVGPathElement => {
    if (!svgLienzoRef.value) {
      console.warn("SVG ref no disponible");
      return document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      ) as SVGPathElement;
    }

    const pos1 = obtenerPosicionSVG(
      origen,
      svgLienzoRef.value.getBoundingClientRect()
    );
    const pos2 = obtenerPosicionSVG(
      destino,
      svgLienzoRef.value.getBoundingClientRect()
    );
    const conn = conexiones.value.get(connectionId)!;

    console.log(`Dibujando conexión: ${connectionId}`, { pos1, pos2 });

    const pathSVG = crearObtenerElementoSVG(connectionId, "path", {
      stroke: "#2563eb",
      "stroke-width": "3",
      fill: "none",
      "marker-end": "url(#puntaFlecha)",
      "data-connection": connectionId,
      "data-conexion-id": connectionId,
      cursor: "pointer",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }) as SVGPathElement;
    pathSVG.addEventListener("click", (e: MouseEvent) =>
      agregarPuntoControl(e)
    );

    const grupoControl = crearObtenerElementoSVG(
      connectionId + "-controles",
      "g",
      { class: "control-group" }
    ) as SVGGElement;
    grupoControl.innerHTML = "";

    const lineasAuxGroup = crearObtenerElementoSVG(
      connectionId + "-lineas-auxiliares",
      "g",
      { class: "lineas-auxiliares" }
    ) as SVGGElement;
    lineasAuxGroup.innerHTML = "";

    if (!conn.controlPoints || conn.controlPoints.length === 0) {
      conn.controlPoints = [
        { x: (pos1.x + pos2.x) / 2, y: (pos1.y + pos2.y) / 2 + 50 },
      ];
    }

    let pathD = `M ${pos1.x} ${pos1.y}`;
    conn.controlPoints.forEach((p) => {
      if (p && p.x !== null && p.y !== null) {
        pathD += ` L ${p.x} ${p.y}`;
      }
    });
    pathD += ` L ${pos2.x} ${pos2.y}`;
    pathSVG.setAttribute("d", pathD);

    conn.controlPoints.forEach((cp, i) => {
      if (cp && cp.x !== null && cp.y !== null) {
        crearCirculoControl(grupoControl, cp.x, cp.y, connectionId, i);
      }
    });

    if (conn.controlPoints && conn.controlPoints.length > 0) {
      const firstCP = conn.controlPoints[0];
      const lastCP = conn.controlPoints[conn.controlPoints.length - 1];
      if (firstCP)
        dibujarLineaAuxiliar(
          lineasAuxGroup,
          pos1.x,
          pos1.y,
          firstCP.x,
          firstCP.y
        );
      for (let i = 0; i < conn.controlPoints.length - 1; i++) {
        const cp1 = conn.controlPoints[i];
        const cp2 = conn.controlPoints[i + 1];
        if (cp1 && cp2)
          dibujarLineaAuxiliar(lineasAuxGroup, cp1.x, cp1.y, cp2.x, cp2.y);
      }
      if (lastCP)
        dibujarLineaAuxiliar(
          lineasAuxGroup,
          lastCP.x,
          lastCP.y,
          pos2.x,
          pos2.y
        );
    }

    const origenId = parseInt(origen.getAttribute("data-nodo-id") || "-1");
    const destinoId = parseInt(destino.getAttribute("data-nodo-id") || "-1");
    agregarEtiquetaTransicion(
      connectionId,
      origenId,
      destinoId,
      conn.controlPoints
    );

    return pathSVG;
  };

  const agregarEtiquetaTransicion = (
    connectionId: string,
    origenId: number,
    destinoId: number,
    controlPoints: Punto[]
  ): void => {
    const nodoOrigen = nodos.value.find((n) => n.id === origenId);
    if (!nodoOrigen) return;

    const transicionesRelacionadas = nodoOrigen.transiciones.filter(
      (t) => t.proximoEstado === destinoId
    );

    if (transicionesRelacionadas.length === 0) return;

    const textoTransiciones = transicionesRelacionadas
      .map((t) => `${t.simboloLee},${t.simboloEscribe}→${t.movimiento}`)
      .join(" | ");

    let posX: number, posY: number;
    if (controlPoints && controlPoints.length > 0) {
      const cp = controlPoints[Math.floor(controlPoints.length / 2)];
      if (!cp) return;
      posX = cp.x;
      posY = cp.y - 15;
    } else {
      return;
    }

    const grupoEtiqueta = crearObtenerElementoSVG(
      connectionId + "-etiqueta",
      "g",
      { class: "etiqueta-transicion" }
    ) as SVGGElement;
    grupoEtiqueta.innerHTML = "";

    const padding = 4;
    const fontSize = 11;
    const textWidth = textoTransiciones.length * 6.5 + padding * 2;
    const textHeight = fontSize + padding * 2;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", (posX - textWidth / 2).toString());
    rect.setAttribute("y", (posY - textHeight / 2).toString());
    rect.setAttribute("width", textWidth.toString());
    rect.setAttribute("height", textHeight.toString());
    rect.setAttribute("rx", "4");
    rect.setAttribute("ry", "4");
    rect.setAttribute("fill", "#1e293b");
    rect.setAttribute("fill-opacity", "0.9");
    grupoEtiqueta.appendChild(rect);

    const texto = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    texto.setAttribute("x", posX.toString());
    texto.setAttribute("y", (posY + 4).toString());
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("font-size", fontSize.toString());
    texto.setAttribute("font-family", "monospace");
    texto.setAttribute("font-weight", "600");
    texto.setAttribute("fill", "#f0fdf4");
    texto.textContent = textoTransiciones;
    grupoEtiqueta.appendChild(texto);
  };

  const actualizarConexionesDelNodo = (nodo: HTMLElement): void => {
    conexiones.value.forEach((conn, id) => {
      if (conn.origen === nodo || conn.destino === nodo) {
        dibujarOActualizarConexion(conn.origen, conn.destino, id);
      }
    });
  };

  const iniciarMovimientoControl = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();

    const circulo = e.target as SVGCircleElement;
    const connectionId = circulo.getAttribute("data-connection")!;
    const puntoIndex = parseInt(circulo.getAttribute("data-point")!);

    dragState.puntoControlEnMovimiento = { circulo, connectionId, puntoIndex };
    dragState.huboMovimientoControl = false; // Reiniciar bandera

    dragState.offsetXControl =
      e.clientX - parseFloat(circulo.getAttribute("cx")!);
    dragState.offsetYControl =
      e.clientY - parseFloat(circulo.getAttribute("cy")!);

    document.addEventListener("mousemove", moverPuntoControl);
    document.addEventListener("mouseup", pararMovimientoControl);
  };

  const moverPuntoControl = (e: MouseEvent): void => {
    if (!dragState.puntoControlEnMovimiento || !svgLienzoRef.value) return;

    dragState.huboMovimientoControl = true;

    const { connectionId, puntoIndex } = dragState.puntoControlEnMovimiento;
    const conn = conexiones.value.get(connectionId)!;
    const svgRect = svgLienzoRef.value.getBoundingClientRect();

    const nuevaX = e.clientX - svgRect.left - dragState.offsetXControl;
    const nuevaY = e.clientY - svgRect.top - dragState.offsetYControl;

    if (conn.controlPoints && conn.controlPoints[puntoIndex]) {
      conn.controlPoints[puntoIndex].x = nuevaX;
      conn.controlPoints[puntoIndex].y = nuevaY;
    }
    dibujarOActualizarConexion(conn.origen, conn.destino, connectionId);
  };

  const pararMovimientoControl = (): void => {
    document.removeEventListener("mousemove", moverPuntoControl);
    document.removeEventListener("mouseup", pararMovimientoControl);
    dragState.puntoControlEnMovimiento = null;

    setTimeout(() => {
      dragState.huboMovimientoControl = false;
    }, 100);
  };

  const distanciaPuntoASegmento = (p: Punto, a: Punto, b: Punto): number => {
    const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);

    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));

    const proyeccion = {
      x: a.x + t * (b.x - a.x),
      y: a.y + t * (b.y - a.y),
    };

    return Math.hypot(p.x - proyeccion.x, p.y - proyeccion.y);
  };

  const agregarPuntoControl = (e: MouseEvent): void => {
    if (dragState.huboMovimientoControl || dragState.puntoControlEnMovimiento) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    dragState.clickEnLinea = true;

    const connectionId = (e.target as SVGElement).getAttribute(
      "data-connection"
    )!;
    const conn = conexiones.value.get(connectionId)!;
    const svgRect = svgLienzoRef.value!.getBoundingClientRect();
    const clickPoint: Punto = {
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    };

    const pos1 = obtenerPosicionSVG(conn.origen, svgRect);
    const pos2 = obtenerPosicionSVG(conn.destino, svgRect);

    const allPoints = [pos1, ...(conn.controlPoints || []), pos2];
    let minDistancia = Infinity;
    let mejorIndice = 0;

    for (let i = 0; i < allPoints.length - 1; i++) {
      const pointA = allPoints[i];
      const pointB = allPoints[i + 1];
      if (pointA && pointB) {
        const distancia = distanciaPuntoASegmento(clickPoint, pointA, pointB);
        if (distancia < minDistancia) {
          minDistancia = distancia;
          mejorIndice = i;
        }
      }
    }

    conn.controlPoints.splice(mejorIndice, 0, clickPoint);
    dibujarOActualizarConexion(conn.origen, conn.destino, connectionId);

    setTimeout(() => {
      dragState.clickEnLinea = false;
    }, 100);
  };

  const eliminarPuntoControl = (
    e: MouseEvent,
    connectionId: string,
    puntoIndex: number
  ): void => {
    e.stopPropagation();
    e.preventDefault();

    const conn = conexiones.value.get(connectionId)!;

    if (puntoIndex < 2) {
      console.log("No se pueden eliminar los puntos de control iniciales.");
      return;
    }

    conn.controlPoints.splice(puntoIndex, 1);
    dibujarOActualizarConexion(conn.origen, conn.destino, connectionId);
  };

  const iniciarMovimiento = (e: MouseEvent, nodo: Nodo): void => {
    e.preventDefault();

    if (!svgLienzoRef.value) {
      console.log("Sin referencia SVG");
      return;
    }

    const target = e.target as SVGElement;
    if (target.ownerDocument?.activeElement instanceof SVGElement) {
      console.log("Clic en SVG ignorado para movimiento");
      return;
    }

    if (dragState.clickEnLinea) {
      console.log("Clic en línea ignorado para movimiento");
      return;
    }

    dragState.huboMovimiento = false;
    dragState.nodoEnMovimiento = nodo;

    const nodoElement = e.target as HTMLElement;
    nodoElement.style.position = "absolute";
    nodoElement.classList.add("arrastrando");

    dragState.offsetX = e.clientX - nodo.x;
    dragState.offsetY = e.clientY - nodo.y;

    document.addEventListener("mousemove", moverElemento);
    document.addEventListener("mouseup", pararMovimiento);
  };

  const moverElemento = (e: MouseEvent): void => {
    if (!dragState.nodoEnMovimiento) return;

    if (!dragState.huboMovimiento) {
      dragState.huboMovimiento = true;
      if (dragState.nodoSeleccionado) {
        dragState.nodoSeleccionado = null;
        console.log("Movimiento detectado: Conexión cancelada.");
      }
    }

    const nuevaX = e.clientX - dragState.offsetX;
    const nuevaY = e.clientY - dragState.offsetY;

    const nodoIndex = nodos.value.findIndex(
      (n) => n.id === dragState.nodoEnMovimiento?.id
    );
    if (nodoIndex !== -1) {
      const nodo = nodos.value[nodoIndex];
      if (nodo) {
        nodo.x = nuevaX;
        nodo.y = nuevaY;
      }
    }

    if (dragState.nodoEnMovimiento?.elemento) {
      actualizarConexionesDelNodo(dragState.nodoEnMovimiento.elemento);
    }
  };

  const pararMovimiento = (): void => {
    if (dragState.nodoEnMovimiento) {
      const nodoElement = document.querySelector(
        `[data-nodo-id="${dragState.nodoEnMovimiento!.id}"]`
      ) as HTMLElement;
      if (nodoElement) nodoElement.classList.remove("arrastrando");
    }

    document.removeEventListener("mousemove", moverElemento);
    document.removeEventListener("mouseup", pararMovimiento);
    dragState.nodoEnMovimiento = null;

    setTimeout(() => {
      dragState.huboMovimiento = false;
    }, 50);
  };

  const seleccionarNodoParaConexion = (e: MouseEvent, nodo: Nodo): void => {
    e.preventDefault();

    if (
      svgLienzoRef.value?.contains(e.target as Node) ||
      dragState.huboMovimiento
    )
      return;

    if (!dragState.nodoSeleccionado) {
      dragState.nodoSeleccionado = nodo;
    } else {
      const connectionId = `conn-${connectionCounter.value++}`;
      const origenElement = document.querySelector(
        `[data-nodo-id="${dragState.nodoSeleccionado!.id}"]`
      ) as HTMLElement;
      const destinoElement = document.querySelector(
        `[data-nodo-id="${nodo.id}"]`
      ) as HTMLElement;

      const esSelfLoop = dragState.nodoSeleccionado.id === nodo.id;

      console.log(`Creando conexión ${connectionId}:`, {
        origen: dragState.nodoSeleccionado!.id,
        destino: nodo.id,
        origenElement,
        destinoElement,
        esSelfLoop,
      });

      const controlPoints: Punto[] = [];
      if (esSelfLoop && svgLienzoRef.value) {
        const svgRect = svgLienzoRef.value.getBoundingClientRect();
        const pos = obtenerPosicionSVG(origenElement, svgRect);
        controlPoints.push(
          { x: pos.x - 60, y: pos.y - 80 },
          { x: pos.x + 60, y: pos.y - 80 }
        );
      }

      conexiones.value.set(connectionId, {
        origen: origenElement,
        destino: destinoElement,
        controlPoints,
      });

      dibujarOActualizarConexion(origenElement, destinoElement, connectionId);
      dragState.nodoSeleccionado = null;
    }
  };

  const removeEventListenersNodes = () => {
    document.removeEventListener("mousemove", moverElemento);
    document.removeEventListener("mouseup", pararMovimiento);
    document.removeEventListener("mousemove", moverPuntoControl);
    document.removeEventListener("mouseup", pararMovimientoControl);
  };

  const agregarEstado = (
    nombre: string,
    x: number = 150,
    y: number = 150,
    esInicial: boolean = false,
    esFinal: boolean = false
  ): Nodo => {
    const nuevoId =
      nodos.value.length > 0
        ? Math.max(...nodos.value.map((n) => n.id)) + 1
        : 0;

    if (esInicial) {
      nodos.value.forEach((n) => (n.esInicial = false));
    }

    const nuevoNodo: Nodo = {
      id: nuevoId,
      label: nombre,
      x,
      y,
      esInicial,
      esFinal,
      transiciones: [],
    };

    nodos.value.push(nuevoNodo);
    return nuevoNodo;
  };

  const eliminarEstado = (nodoId: number) => {
    nodos.value = nodos.value.filter((n) => n.id !== nodoId);

    const conexionesAEliminar: string[] = [];
    conexiones.value.forEach((conn, id) => {
      const origenId = parseInt(
        conn.origen.getAttribute("data-nodo-id") || "0"
      );
      const destinoId = parseInt(
        conn.destino.getAttribute("data-nodo-id") || "0"
      );

      if (origenId === nodoId || destinoId === nodoId) {
        conexionesAEliminar.push(id);
      }
    });

    conexionesAEliminar.forEach((id) => {
      conexiones.value.delete(id);
      const pathElement = document.getElementById(id);
      const controlGroup = document.getElementById(id + "-controles");
      const auxLines = document.getElementById(id + "-lineas-auxiliares");
      const etiqueta = document.getElementById(id + "-etiqueta");

      pathElement?.remove();
      controlGroup?.remove();
      auxLines?.remove();
      etiqueta?.remove();
    });

    nodos.value.forEach((n) => {
      n.transiciones = n.transiciones.filter((t) => t.proximoEstado !== nodoId);
    });
  };

  const actualizarEstado = (
    nodoId: number,
    nombre?: string,
    esInicial?: boolean,
    esFinal?: boolean
  ) => {
    const nodo = nodos.value.find((n) => n.id === nodoId);
    if (!nodo) return;

    if (nombre) nodo.label = nombre;
    if (esFinal !== undefined) nodo.esFinal = esFinal;

    if (esInicial !== undefined && esInicial) {
      nodos.value.forEach((n) => (n.esInicial = n.id === nodoId));
    }
  };

  const agregarTransicion = (
    nodoOrigen: number,
    simboloLee: string,
    simboloEscribe: string,
    movimiento: "L" | "R" | "S",
    nodoDestino: number
  ): Transicion => {
    const nodo = nodos.value.find((n) => n.id === nodoOrigen);
    if (!nodo) throw new Error(`Nodo ${nodoOrigen} no encontrado`);

    const transicion: Transicion = {
      id: `trans-${Date.now()}-${Math.random()}`,
      simboloLee,
      simboloEscribe,
      movimiento,
      proximoEstado: nodoDestino,
    };

    nodo.transiciones.push(transicion);
    return transicion;
  };

  const eliminarTransicion = (nodoId: number, transicionId: string) => {
    const nodo = nodos.value.find((n) => n.id === nodoId);
    if (!nodo) return;

    nodo.transiciones = nodo.transiciones.filter((t) => t.id !== transicionId);
  };

  const crearConexionVisual = (origenId: number, destinoId: number): void => {
    let conexionExiste = false;
    conexiones.value.forEach((conn) => {
      const connOrigenId = parseInt(
        conn.origen.getAttribute("data-nodo-id") || "0"
      );
      const connDestinoId = parseInt(
        conn.destino.getAttribute("data-nodo-id") || "0"
      );
      if (connOrigenId === origenId && connDestinoId === destinoId) {
        conexionExiste = true;
      }
    });

    if (conexionExiste) return;

    const origenElement = document.querySelector(
      `[data-nodo-id="${origenId}"]`
    ) as HTMLElement;
    const destinoElement = document.querySelector(
      `[data-nodo-id="${destinoId}"]`
    ) as HTMLElement;

    if (!origenElement || !destinoElement) return;

    const connectionId = `conn-${connectionCounter.value++}`;
    const esSelfLoop = origenId === destinoId;

    const controlPoints: Punto[] = [];
    if (esSelfLoop && svgLienzoRef.value) {
      const svgRect = svgLienzoRef.value.getBoundingClientRect();
      const pos = obtenerPosicionSVG(origenElement, svgRect);
      controlPoints.push(
        { x: pos.x - 60, y: pos.y - 80 },
        { x: pos.x + 60, y: pos.y - 80 }
      );
    }

    conexiones.value.set(connectionId, {
      origen: origenElement,
      destino: destinoElement,
      controlPoints,
    });

    dibujarOActualizarConexion(origenElement, destinoElement, connectionId);
  };

  const sincronizarConexionesDeNodo = (nodoId: number): void => {
    const nodo = nodos.value.find((n) => n.id === nodoId);
    if (!nodo) return;

    const destinosUnicos = new Set<number>();
    nodo.transiciones.forEach((trans) => {
      destinosUnicos.add(trans.proximoEstado);
    });

    destinosUnicos.forEach((destinoId) => {
      setTimeout(() => {
        crearConexionVisual(nodoId, destinoId);
      }, 150);
    });

    setTimeout(() => {
      actualizarEtiquetasDeNodo(nodoId);
    }, 200);
  };

  const actualizarEtiquetasDeNodo = (nodoId: number): void => {
    conexiones.value.forEach((conn, connectionId) => {
      const origenId = parseInt(
        conn.origen.getAttribute("data-nodo-id") || "-1"
      );
      if (origenId === nodoId) {
        dibujarOActualizarConexion(conn.origen, conn.destino, connectionId);
      }
    });
  };

  const obtenerTransicion = (
    nodoId: number,
    simboloLee: string
  ): Transicion | undefined => {
    const nodo = nodos.value.find((n) => n.id === nodoId);
    if (!nodo) return undefined;

    return nodo.transiciones.find((t) => t.simboloLee === simboloLee);
  };

  const obtenerEstadoInicial = (): Nodo | undefined => {
    return nodos.value.find((n) => n.esInicial);
  };

  const limpiarLienzo = () => {
    nodos.value = [];
    conexiones.value.clear();

    if (svgLienzoRef.value) {
      const pathElements = svgLienzoRef.value.querySelectorAll("path");
      const groupElements = svgLienzoRef.value.querySelectorAll("g");

      pathElements.forEach((p) => {
        if (!p.id.includes("punta")) p.remove();
      });

      groupElements.forEach((g) => {
        if (!g.id.includes("marker")) g.remove();
      });
    }
  };

  const exportarJSON = (): string => {
    const datos = {
      nodos: nodos.value.map((n) => ({
        id: n.id,
        label: n.label,
        x: n.x,
        y: n.y,
        esInicial: n.esInicial,
        esFinal: n.esFinal,
        transiciones: n.transiciones,
      })),
      conexiones: Array.from(conexiones.value.entries()).map(([id, conn]) => ({
        id,
        origenId: parseInt(conn.origen.getAttribute("data-nodo-id") || "0"),
        destinoId: parseInt(conn.destino.getAttribute("data-nodo-id") || "0"),
        controlPoints: conn.controlPoints,
      })),
    };

    return JSON.stringify(datos, null, 2);
  };

  const importarJSON = (jsonString: string) => {
    try {
      const datos = JSON.parse(jsonString);

      limpiarLienzo();

      if (datos.nodos && Array.isArray(datos.nodos)) {
        datos.nodos.forEach((nodoData: any) => {
          const nodo = agregarEstado(
            nodoData.label,
            nodoData.x,
            nodoData.y,
            nodoData.esInicial,
            nodoData.esFinal
          );
          nodo.id = nodoData.id;
          nodo.transiciones = nodoData.transiciones || [];
        });
      }

      setTimeout(() => {
        nodos.value.forEach(nodo => {
            const el = document.querySelector(`[data-nodo-id="${nodo.id}"]`) as HTMLElement;
            if (el) {
                nodo.elemento = el;
            } else {
                console.warn(`No se encontró el elemento DOM para el nodo importado ${nodo.id}`);
            }
        });

        if (datos.conexiones && Array.isArray(datos.conexiones)) {
          datos.conexiones.forEach((connData: any) => {
            const origen = document.querySelector(
              `[data-nodo-id="${connData.origenId}"]`
            ) as HTMLElement;
            const destino = document.querySelector(
              `[data-nodo-id="${connData.destinoId}"]`
            ) as HTMLElement;

            if (origen && destino) {
              conexiones.value.set(connData.id, {
                origen,
                destino,
                controlPoints: connData.controlPoints || [],
              });
              dibujarOActualizarConexion(origen, destino, connData.id);
            } else {
              console.warn(
                `No se pudieron encontrar los nodos para la conexión:`,
                connData
              );
            }
          });
        }
      }, 200);

      console.log("Configuración importada exitosamente");
    } catch (error) {
      console.error("Error al importar JSON:", error);
      throw new Error("JSON inválido");
    }
  };

  return {
    svgLienzoRef,
    nodos,
    conexiones,
    dragState,
    iniciarMovimiento,
    seleccionarNodoParaConexion,
    dibujarOActualizarConexion,
    removeEventListenersNodes,

    agregarEstado,
    eliminarEstado,
    actualizarEstado,
    agregarTransicion,
    eliminarTransicion,
    obtenerTransicion,
    obtenerEstadoInicial,
    limpiarLienzo,
    exportarJSON,
    importarJSON,

    crearConexionVisual,
    sincronizarConexionesDeNodo,
  };
});

export default useNodosStore;
