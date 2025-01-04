import {postRegistryApi} from "./main-registry.js";
(async function () {
    const currentUrl = window.location.href;
    const uniqueId = currentUrl.split('/').pop();
    await postRegistryApi(`Registry/AcceptPayment/${uniqueId}`);

    setInterval(async function () {
        window.location.href = "registries.html";
    }, 4000)
})()