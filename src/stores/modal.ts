import { ref } from "vue";
import { defineStore } from "pinia";

const useModalStore = defineStore("modal", () => {
  const isModalMessageOpen = ref(false);
  const isModalConfirmOpen = ref(false);

  const modalTitle = ref("");
  const modalMessage = ref("");

  const modalAction = ref<(() => void) | null>(null);

  const openModal = (
    title: string,
    message: string,
    isModalConfirm: boolean = false
  ) => {
    modalTitle.value = title;
    modalMessage.value = message;
    isModalMessageOpen.value = true;
    if (isModalConfirm) {
      isModalConfirmOpen.value = true;
    } else {
      isModalConfirmOpen.value = false;
    }
  };

  const closeModal = () => {
    isModalMessageOpen.value = false;
    isModalConfirmOpen.value = false;
    modalTitle.value = "";
    modalMessage.value = "";
  };

  return {
    isModalMessageOpen,
    isModalConfirmOpen,
    modalTitle,
    modalMessage,
    modalAction,
    openModal,
    closeModal,
  };
});

export default useModalStore;
