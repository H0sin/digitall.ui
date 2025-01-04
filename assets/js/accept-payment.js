import {postRegistryApi, updateRegistryApi} from "./main-registry.js";
(async function () {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    await updateRegistryApi(`Registry/AcceptPayment/${params.get(unique)}`);

    setInterval(async function () {
        window.location.href = "registries.html";
    }, 4000)
})()