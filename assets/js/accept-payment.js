import {postRegistryApi} from "../assets/js/main-registry";
(async function () {
    const currentUrl = window.location.href;
    const uniqueId = currentUrl.split('/').pop();
    await postRegistryApi(`Registry/AcceptPayment/${uniqueId}`);

    setInterval(async function () {
        window.location.href = "registries.html";
    }, 4000)
})()