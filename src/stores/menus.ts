import { ref } from "vue";
import { defineStore } from "pinia";

const useMenusStore = defineStore("menus", () => {
  const menu = ref<HTMLElement | null>(null);
  const modal = ref<HTMLDialogElement | null>(null);
  const modalVisible = ref(false);
  const readSymbol = ref("");
  const writeSymbol = ref("");
  const moveSymbol = ref("");

  let offsetXMenu = 0;
  let offsetYMenu = 0;
  let elementoSeleccionado: HTMLElement | null = null;

  function initializeMenuElements(e: MouseEvent) {
    if (e.target instanceof HTMLElement)
      if (e.target.tagName === "INPUT") return;

    e.preventDefault();
    const target = e.target as HTMLElement;
    elementoSeleccionado = target.closest(".menu, .modal_test, .panel-transiciones");
    if (!elementoSeleccionado) return;

    offsetXMenu = e.clientX - elementoSeleccionado.offsetLeft;
    offsetYMenu = e.clientY - elementoSeleccionado.offsetTop;
    document.addEventListener("mousemove", moverMenu);
    document.addEventListener("mouseup", pararMenu);
  }

  function moverMenu(e: MouseEvent) {
    if (!elementoSeleccionado) return;

    let nuevaX = e.clientX - offsetXMenu;
    let nuevaY = e.clientY - offsetYMenu;

    nuevaX = Math.max(
      0,
      Math.min(nuevaX, window.innerWidth - elementoSeleccionado.offsetWidth)
    );
    nuevaY = Math.max(
      0,
      Math.min(nuevaY, window.innerHeight - elementoSeleccionado.offsetHeight)
    );

    elementoSeleccionado.style.left = nuevaX + "px";
    elementoSeleccionado.style.top = nuevaY + "px";
  }

  function pararMenu() {
    document.removeEventListener("mousemove", moverMenu);
    document.removeEventListener("mouseup", pararMenu);
    elementoSeleccionado = null;
  }

  const setupEventListenersMenu = () => {
    if (menu.value) {
      menu.value.addEventListener("mousedown", initializeMenuElements);
    }
    if (modal.value) {
      modal.value.addEventListener("mousedown", initializeMenuElements);
    }
  };

  const removeEventListenersMenu = () => {
    if (menu.value) {
      menu.value.removeEventListener("mousedown", initializeMenuElements);
    }
    if (modal.value) {
      modal.value.removeEventListener("mousedown", initializeMenuElements);
    }
  };

  return {
    menu,
    modal,
    modalVisible,
    readSymbol,
    writeSymbol,
    moveSymbol,
    initializeMenuElements,
    moverMenu,
    pararMenu,
    setupEventListenersMenu,
    removeEventListenersMenu,
  };
});

export default useMenusStore;
