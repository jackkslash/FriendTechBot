import { sleep } from "./utils";

export const fetchPlus: any = (url: any, options = {}, retries: any) =>
  fetch(url, options)
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      if (retries > 0) {
        console.log("fetch retry " + retries + "url: " + url);
        await sleep(1500);
        return fetchPlus(url, options, retries - 1);
      }
    })
    .catch((error) => console.error(error.message));
