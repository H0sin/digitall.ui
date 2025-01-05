import {gregorianToJalali, hiddenLoading, showLoading} from "./main.js";
import {getRegistryApi, ready, supporter, fixedRegistryStatus} from "./main-registry.js";

(async function () {
    await showLoading();

    await ready;

    const id = new URLSearchParams(new URL(window.location.href).search).get("id");
    if (!id) window.location.href = "registries.html";

    let registry = await getRegistryApi(`Registry/${supporter ? 'RegistryById' : 'GetRegistryById'}/${id}`);

    $.each($("[data-value]"), function (key, value) {

        let tag = $(value);
        let draft = $(value).attr("data-draft") || "";
        let val = registry[$(value).attr("data-value")];
        if (val) {
            switch (tag.attr("data-type")) {
                case "date":
                    tag.html(draft + " : " + gregorianToJalali(val));
                    break;
                case "status":
                    tag.html(draft + " : " + fixedRegistryStatus(val));
                    break;
                default:
                    tag.html(draft + " : " + val);
                    break;
            }
        } else tag.remove();
    });
    
    
    const btnAction = $("<div class='col btn-group mt-3'></div>");
    const statusModal = $(`
        <button type="button" class="btn btn-primary">
            تغییر وضعیت
        </button>
    `);

    statusModal.attr('data-bs-toggle', 'modal');
    statusModal.attr('data-bs-target', '#statusModal');

    btnAction.append(statusModal);

    $("#informationRegistery").append(btnAction);

    await hiddenLoading();
})();





