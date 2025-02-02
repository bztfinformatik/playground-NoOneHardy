// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// //Vuetify experimental
// import { VDataTable } from "vuetify/labs/VDataTable";

const vuetify = createVuetify({
  components: { ...components },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  directives,
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

// Vuetify
app.use(vuetify);

app.mount('#app')
