import useHelpers from "../hooks/helpers.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user.js";
import { useErrorStore } from "../stores/error.js";

export default function useMountains() {
  const { jwt, id: userId } = storeToRefs(useUserStore());
  const { isAuthenticated } = storeToRefs(useUserStore());
  const { alert } = useErrorStore();

  const { checkHttpStatus } = useHelpers();
  const backendHost = import.meta.env.VITE_BACKEND;

  async function loadMountainList() {
    try {
      let res;
      let mntList;

      if (isAuthenticated.value) {
        res = await fetch(`${backendHost}/users/${userId.value}/mnts`, {
          headers: {
            Authorization: `Bearer ${jwt.value}`,
          },
        });
      } else {
        res = await fetch(`${backendHost}/mnts`);
      }
      checkHttpStatus(res);
      mntList = await res.json();
      return mntList;
    } catch (err) {
      alert(err.message, "error");
    }
  }

  async function loadMountain(mntId) {
    try {
      let res;
      let mnt;

      if (isAuthenticated.value) {
        res = await fetch(
          `${backendHost}/users/${userId.value}/mnts/${mntId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt.value}`,
            },
          }
        );
      } else {
        res = await fetch(`${backendHost}/mnts/${mntId}`);
      }
      checkHttpStatus(res);
      mnt = await res.json();
      return mnt;
    } catch (err) {
      alert(err.message, "error");
    }
  }

  return { loadMountainList, loadMountain };
}
