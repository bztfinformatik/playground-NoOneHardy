<template>
  <v-card class="d-flex flex-column">
    <form @submit="onSubmit">
      <v-card-title>Neuen Berg erfassen:</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="mntName.value.value"
          label="Name"
          :error-messages="errors.mntName"
          dense
          clearable
        ></v-text-field>
        <v-text-field
          v-model="mntLatitude.value.value"
          label="Breitengrad"
          :error-messages="errors.mntLatitude"
          dense
          clearable
        ></v-text-field>
        <v-text-field
          v-model="mntLongitude.value.value"
          label="Längengrad"
          :error-messages="errors.mntLongitude"
          dense
          clearable
        ></v-text-field>
        <v-text-field
          v-model="mntElevation.value.value"
          label="Höhe"
          :error-messages="errors.mntElevation"
          dense
          clearable
        ></v-text-field>
        <v-file-input
          v-model="file"
          accept="image/png image/jpg image/jpeg"
          label="Datei"
          dense
          clearable
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="mt-auto d-flex justify-end" width="100">
        <v-btn icon="mdi-close" @click="cancel"> </v-btn>
        <v-btn variant="tonal" type="submit" icon="mdi-check"> </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../stores/user.js";
import { useErrorStore } from "../stores/error.js";
import useHelpers from "../hooks/helpers.js";
import { storeToRefs } from "pinia";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

export default {
  emits: ["cancelNewMnt", "saveNewMnt"],

  setup(porps, ctx) {
    const { jwt, id: userId, isAuthenticated } = storeToRefs(useUserStore());

    const { alert } = useErrorStore();
    const { checkHttpStatus } = useHelpers();

    const { handleSubmit, errors } = useForm({
      validationSchema: yup.object({
        mntName: yup.string().required("Pflichtfeld"),
        mntLatitude: yup
          .number()
          .min(-90.0, "Breitengrad >= -90.0°")
          .max(90.0, "Breitengrad <= 90.0°")
          .required("Pflichtfeld")
          .typeError("Breitengrad muss eine Zahl sein"),
        mntLongitude: yup
          .number()
          .min(-180.0, "Längengrad >= -180.0°")
          .max(180.0, "Längengrad >= 180.0°")
          .required("Pflichtfeld")
          .typeError("Längengrad muss eine Zahl sein"),
        mntElevation: yup
          .number()
          .integer("Höhe muss eine ganze Zahl sein")
          .required("Pflichtfeld")
          .typeError("Höhe muss eine ganze Zahl sein"),
      }),
    });

    const mntName = useField("mntName");
    const mntLatitude = useField("mntLatitude");
    const mntLongitude = useField("mntLongitude");
    const mntElevation = useField("mntElevation");
    const file = ref([]);

    const onSubmit = handleSubmit((values) => {
      save();
    });

    function cancel() {
      ctx.emit("cancelNewMnt");
    }

    async function save() {
      try {
        let res;
        // step 1: create new mountain object at backend (without image)
        let reqBody = JSON.stringify({
          name: mntName.value.value,
          elevation: mntElevation.value.value,
          latitude: mntLatitude.value.value,
          longitude: mntLongitude.value.value,
          hasmountainrailway: false,
        });
        let postReqHeaders = { "Content-Type": "application/json" };
        let putReqHeaders = {};

        // add JWT to request header, if user-specific mountain should be added
        if (isAuthenticated.value) {
          postReqHeaders["Authorization"] = `Bearer ${jwt.value}`;
          putReqHeaders["Authorization"] = `Bearer ${jwt.value}`;
        }

        if (isAuthenticated.value) {
          res = await fetch(
            `${import.meta.env.VITE_BACKEND}/users/${userId.value}/mnts`,
            {
              method: "POST",
              headers: postReqHeaders,
              body: reqBody,
            }
          );
        } else {
          res = await fetch(`${import.meta.env.VITE_BACKEND}/mnts`, {
            method: "POST",
            headers: postReqHeaders,
            body: reqBody,
          });
        }

        checkHttpStatus(res);
        let savedMnt = await res.json();

        // step 2: get id of newly created mountain, then upload image
        const mntId = savedMnt.properties.id;
        reqBody = new FormData();
        reqBody.append("image", file.value);

        if (isAuthenticated.value) {
          res = await fetch(
            `${import.meta.env.VITE_BACKEND}/users/${
              userId.value
            }/mnts/${mntId}/img`,
            {
              method: "PUT",
              body: reqBody,
              headers: putReqHeaders,
            }
          );
        } else {
          res = await fetch(
            `${import.meta.env.VITE_BACKEND}/mnts/${mntId}/img`,
            {
              method: "PUT",
              body: reqBody,
            }
          );
        }

        checkHttpStatus(res);
        savedMnt = await res.json();

        // step 3: notify parent component (gallery component) of newly added mountain
        ctx.emit("saveNewMnt", mntId);
      } catch (err) {
        alert(err.message, "error");
      }
    }

    return {
      mntName,
      mntLatitude,
      mntLongitude,
      mntElevation,
      file,
      errors,
      onSubmit,
      cancel,
      save,
    };
  },
};
</script>

<style scoped></style>
