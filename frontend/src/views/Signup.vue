<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Sign Up</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="auth.username"
                  id="username"
                  label="Username / Mailadresse"
                  name="login"
                  type="text"
                />
                <v-text-field
                  v-model="auth.pwd"
                  id="pwd"
                  label="Passwort"
                  name="password"
                  type="password"
                />
                <v-text-field
                  v-model="auth.firstname"
                  id="firstname"
                  label="Vorname"
                  name="firstname"
                  type="text"
                />
                <v-text-field
                  v-model="auth.lastname"
                  id="lastname"
                  label="Nachname"
                  name="lastname"
                  type="text"
                />
                <v-radio-group v-model="auth.avatar" inline :mandatory="true">
                  <v-radio
                    v-for="avatar in avatars"
                    :key="avatar"
                    :value="avatar"
                  >
                    <template #label>
                      <img :src="avatar" width="20" />
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="signup" color="primary">Signup</v-btn>
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
import { storeToRefs } from "pinia";
import useHelpers from "../hooks/helpers.js";
import { useErrorStore } from "../stores/error.js";


export default {
  setup() {
    const backend = import.meta.env.VITE_BACKEND;
    const { checkHttpStatus } = useHelpers();
    const { alert } = useErrorStore();

    // const auth = reactive({
    //   username: "",
    //   pwd: "",
    // });
    const avatars = reactive([]);
    const auth = reactive({
      username: "",
      pwd: "",
      firstname: "",
      lastname: "",
      avatar: "",
    });

    const router = useRouter();
    const { isAuthenticated } = storeToRefs(useUserStore());

    async function login() {
      const { login } = useUserStore();
      await login(auth.username, auth.pwd);
      if (isAuthenticated.value) {
        router.push({ name: "mountains" });
      }
    }

    // (async () => {
    //   await loadAvatars();
    // })();
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/avatars`);
        checkHttpStatus(res);
        const resBody = await res.json();
        for (const item of resBody) {
          avatars.push(item);
        }
      } catch (err) {
        alert(err.message, "warning");
      }
    })();

    async function signup() {
      const backendHost = import.meta.env.VITE_BACKEND;
      try {
        let res = await fetch(`${backend}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: auth.username,
            pwd: auth.pwd,
            firstname: auth.firstname,
            lastname: auth.lastname,
            avatar: auth.avatar.substring(auth.avatar.lastIndexOf("/") + 1),
          }),
        });
        if (res.status == 409) {
          console.log("3");
          throw new Error("Username already exists.");
        }
        checkHttpStatus(res);

        router.push({ name: "login" });
        alert("Signup successfu", "success");
      } catch (err) {
        alert(err.message, "warning");
      }
    }

    return { auth, avatars, signup };
  },
};
</script>
