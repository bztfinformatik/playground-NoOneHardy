import { ref } from "vue";
import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", () => {
  const isAlertOn = ref(false);
  const alertmsg = ref("");
  const alertcolor = ref("error");

  function alert(msg, color) {
    isAlertOn.value = true;
    alertmsg.value = msg;
    alertcolor.value = color;
  }

  return {
    isAlertOn,
    alertmsg,
    alertcolor,
    alert,
  };
});
