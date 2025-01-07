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
    
    
    const btnAction = $("<div class='col btn-group mt-3 w-100'></div>");
    const statusModal = $(`
        <button type="button" class="btn btn-outline-primary">
            تغییر وضعیت
        </button>
    `);
    const modal_footer = $(".modal-footer");
    modal_footer.html("");

    modal_footer.append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>`);

    let awaiting_supporter_review_button = `<button type="button" id="supporter-${registry.id}" class="text-white btn btn-primary">در انتظار برسی پشتیبان</button>`;
    let awaiting_payment_button = `<button type="button" id="payment-${registry.id}" class="text-white btn btn-info">در انتظار پرداخت</button>`;
    let rejected_button = `<button type="button" id="reject-${registry.id}" class="text-white btn btn-danger">رد شده</button>`;
    let process_button = `<button type="button" id="process-${registry.id}" class="text-white btn btn-warning">در صف عملیات</button>`;



    statusModal.attr('data-bs-toggle', 'modal');
    statusModal.attr('data-bs-target', '#statusModal');

    btnAction.append(statusModal);

    $("#informationRegistery").append(btnAction);


    if (registry.status === 1) {
        modal_footer.append(awaiting_supporter_review_button);
    } else if (registry.status === 2) {
        modal_footer.append(awaiting_payment_button);
    } else if (registry.status === 3) {
        modal_footer.append(rejected_button);
    }else if (registry.status === 4) {
        modal_footer.append(process_button);
    }

    await hiddenLoading();
})();





