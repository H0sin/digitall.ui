import {hiddenLoading, showLoading} from "./main.js";
import {getRegistryApi, ready, supporter} from "./main-registry.js";

(async function () {
    await ready;

    await showLoading();

    const id = new URLSearchParams(new URL(window.location.href).search).get("id");
    if (!id) window.location.href = "registries.html";

    let registry = await getRegistryApi(`Registry/${supporter ? 'RegistryById' : 'GetRegistryById'}/${id}`);



    await hiddenLoading();
})()