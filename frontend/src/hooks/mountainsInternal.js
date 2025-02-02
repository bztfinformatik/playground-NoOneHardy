import { computed } from "vue";
import appdata from "@/assets/appdata.json";

export default function useMountainInternal(mntId) {
  const mnt = computed(() => {
    const allMnts = appdata.mountains.features;
    return allMnts.find((item) => item.properties.id === mntId).properties;
  });

  const mntImgUrl = computed(
    () => new URL(`../assets/img/${mnt.value.img}`, import.meta.url).href
  );

  return { mnt, mntImgUrl };
}
