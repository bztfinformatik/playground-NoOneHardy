<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="mnt in mnts" :key="mnt" cols="12" sm="6" md="4" lg="3">
        <app-mountain :mntId="mnt"></app-mountain>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-if="!isInputFormVisible"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex align-end"
      >
        <v-btn variant="tonal" icon="mdi-plus" @click="showInputForm"> </v-btn>
      </v-col>
      <v-col v-else cols="12" sm="6" md="4" lg="3">
        <app-mountain-input-form
          class="fill-height"
          @saveNewMnt="save"
          @cancelNewMnt="cancel"
        ></app-mountain-input-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Mountain from "@/components/Mountain.vue";
import MountainInputForm from "@/components/MountainInputForm.vue";
import useMountains from "@/hooks/mountains.js";
import { ref } from "vue";

export default {
  setup() {
    const mnts = ref([]);
    const isInputFormVisible = ref(false);
    const { loadMountainList } = useMountains();

    function cancel() {
      isInputFormVisible.value = false;
    }

    function save(mntId) {
      mnts.value.push(mntId);
      isInputFormVisible.value = false;
    }

    function showInputForm() {
      isInputFormVisible.value = true;
    }

    (async () => {
      mnts.value = await loadMountainList();
    })();

    return { mnts, isInputFormVisible, showInputForm, cancel, save };
  },

  components: {
    "app-mountain": Mountain,
    "app-mountain-input-form": MountainInputForm,
  },
};
</script>

<style scoped></style>
