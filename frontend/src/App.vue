<template>
  <v-app id="foofoo">
    <v-app-bar color="primary" density="compact">
      <v-toolbar-title>
        <v-btn text :to="{ name: 'mountains' }">Mountain Gallery</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        <span class="mr-2 body-2 font-weight-light text-none"
          >{{ firstname }} {{ lastname }}</span
        >
        <v-avatar>
          <img :src="avatar" width="25" />
        </v-avatar>
        <v-btn text @click="logout">
          <span class="mr-2 body-1 font-weight-light text-none">Logout</span>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-btn text :to="{ name: 'signup' }" class="mx-2">
          <span class="mr-2 body-1 font-weight-light text-none">Sign Up</span>
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn text :to="{ name: 'login' }" class="mx-2">
          <span class="mr-2 body-1 font-weight-light text-none">Login</span>
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </div>

      <v-snackbar
        v-model="isAlertOn"
        location="top"
        :color="alertcolor"
        timeout="3000"
      >
        <template #actions
          ><v-btn variant="text" @click="close" right>Close</v-btn></template
        >
        {{ alertmsg }}
      </v-snackbar>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useErrorStore } from "./stores/error.js";
import { useUserStore } from "./stores/user.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const { isAlertOn, alertmsg, alertcolor } = storeToRefs(useErrorStore());
    const { firstname, lastname, avatar, isAuthenticated } = storeToRefs(
      useUserStore()
    );

    const { $reset } = useUserStore();
    const router = useRouter();

    const isVisible = ref(false);

    function swap() {
      isVisible.value = !isVisible.value;
    }

    function close() {
      isAlertOn.value = false;
    }

    function logout() {
      $reset();
      router.push({ name: "login" });
    }

    return {
      isVisible,
      swap,
      isAlertOn,
      alertmsg,
      alertcolor,
      close,
      isAuthenticated,
      firstname,
      lastname,
      avatar,
      logout,
    };
  },
};
</script>
