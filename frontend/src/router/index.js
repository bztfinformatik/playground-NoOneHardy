import { createRouter, createWebHistory } from "vue-router";
import MountainGallery from "../views/MountainGallery.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "mountains",
      component: MountainGallery,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },
  ],
});

export default router;
