import { ref, computed } from "vue";
import { defineStore } from "pinia";
import useHelpers from "../hooks/helpers";

const { isEmpty } = useHelpers();

// setup user-store
// (anonymous) function which is passed in to "defineStore" has a similar structure
// to the setup-method of vue-component
export const useUserStore = defineStore("user", () => {
  // define reactive state values
  const jwt = ref("");
  const id = ref("");
  const username = ref("");
  const firstname = ref("");
  const lastname = ref("");
  const role = ref("");
  const avatar = ref("");

  // define computed values (derived values)
  const isAuthenticated = computed(() => !isEmpty(jwt.value));

  // (if needed) define a $reset-method
  // $-sign-methods are built-in methods in vue/pinia, which are normaly predefined,
  // however, in this case $reset() must be defined
  function $reset() {
    jwt.value = "";
    id.value = "";
    username.value = "";
    firstname.value = "";
    lastname.value = "";
    role.value = "";
    avatar.value = "";
  }

  // expose state values, computed values and methods
  return {
    jwt,
    id,
    username,
    firstname,
    lastname,
    role,
    avatar,
    isAuthenticated,
    $reset,
  };
});
