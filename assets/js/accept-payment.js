import {postRegistryApi, updateRegistryApi} from "./main-registry.js";
(async function () {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const unique = params.get('unique');
    await updateRegistryApi(`Registry/AcceptPayment/${unique}`);

    setInterval(async function () {
        window.location.href = "registries.html";
    }, 4000)
})()