<template>
  <v-card>
    <v-img aspect-ratio="1.6" cover :src="mnt.img" />
    <v-card-title>
      {{ mnt.name }}
    </v-card-title>
    <div class="d-flex">
      <v-card-text>Höhe: {{ mnt.el }}m</v-card-text>
    </div>
  </v-card>
</template>

<script>
import useMountains from "@/hooks/mountains.js";
import { reactive, computed } from "vue";

export default {
  setup(props) {
    const { loadMountain } = useMountains();

    const mnt = reactive({
      id: "",
      name: "",
      img: "",
      el: 0,
      hasMountainRailway: false,
    });

    (async () => {
      const loadedMnt = await loadMountain(props.mntId);
      mnt.name = loadedMnt.properties.name;
      mnt.el = loadedMnt.properties.el;
      mnt.img = loadedMnt.properties.img;
    })();


    return { mnt };
  },
  props: {
    mntId: Number,
  },
};
</script>

<style scoped></style>
