import { defineStore } from "pinia";
import useNodosStore from "@/stores/nodos";
import useModalStore from "./modal";

const useJsonExportImportStore = defineStore("exportOrImport", () => {
  const useModal = useModalStore();
  const nodosStore = useNodosStore();

  const exportarJSON = () => {
    const json = nodosStore.exportarJSON();
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(json)
    );
    element.setAttribute("download", "maquina-turing.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const importarJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          nodosStore.importarJSON(event.target.result);
          useModal.openModal(
            "Importación exitosa",
            "Configuración importada exitosamente"
          );
        } catch (error) {
          useModal.openModal(
            "Error al importar",
            "Error al importar: " + error
          );
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return {
    exportarJSON,
    importarJSON,
  };
});

export default useJsonExportImportStore;
