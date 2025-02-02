<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  id="username"
                  label="Username / Mailadresse"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="auth.username"
                />

                <v-text-field
                  id="pwd"
                  label="Passwort"
                  name="pwd"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="auth.pwd"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="login" color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useErrorStore } from "../stores/error.js";
import { storeToRefs } from "pinia";
import useHelpers from "../hooks/helpers";

export default {
  setup() {
    const { checkHttpStatus, isEmpty } = useHelpers();
    const router = useRouter();
 
    const auth = reactive({
      username: "",
      pwd: "",
    });

    async function login() {
      const backendHost = import.meta.env.VITE_BACKEND;
      const { jwt, username, id, firstname, lastname, role, avatar } =
        storeToRefs(useUserStore());
      const { alert } = useErrorStore();
      try {
        const res = await fetch(`${backendHost}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: auth.username,
            pwd: auth.pwd,
          }),
        });

        checkHttpStatus(res);
        const resBody = await res.json();

        jwt.value = resBody.jwt;
        username.value = resBody.username;
        id.value = resBody.id;
        firstname.value = resBody.firstname;
        lastname.value = resBody.lastname;
        role.value = resBody.role;
        avatar.value = resBody.avatar;

        alert("Loging successful", "success");
        router.push({ name: "mountains" });
      } catch (err) {
        alert(err.message, "warning");
      }
    }

    return { auth, login };
  },
};
</script>
