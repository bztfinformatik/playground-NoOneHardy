export default function useHelpers() {
  function checkHttpStatus(res) {
    if (!res.ok) {
      throw new Error(`HTTP-Status: ${res.status} - ${res.statusText}`);
    }
  }

  function isEmpty(obj) {
    let isEmpty = false;

    if (!obj || (Object.keys(obj).length === 0 && obj.constructor === Object)) {
      isEmpty = true;
    }

    return isEmpty;
  }

  return { checkHttpStatus, isEmpty };
}
