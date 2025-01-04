import * as registry from "./main-registry.js";
import * as main from "./main.js";
import {destroidModal, errorTheme, errorTitle, notificationMessage, warningTheme, warningTitle} from "./main.js";
import {paymentConnection, ready, supporterOnlineConnection, supporter} from "./main-registry.js";


// -------------------------------------------------------------------------------------

const payment_information = (price, link) => `
    <div class="payment-container text-center" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; max-width: 400px; margin: 20px auto;">
        <h2 style="color: #333; margin-bottom: 10px;">اطلاعات پرداخت</h2>
        <h5 style="color: #555; margin-bottom: 20px;">مبلغ: <span style="font-weight: bold;">${price.toLocaleString()} ریال</span></h5>
        <p style="color: #777; font-size: 14px; margin-bottom: 20px;">
            توجه: لطفاً هنگام پرداخت، مبلغ ذکرشده را دقیقاً به ریال وارد کنید. مسئولیت هرگونه اشتباه بر عهده خریدار است.
        </p>
        <div style="margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="copyToClipboard('${price}')" style="padding: 10px 15px; font-size: 14px;">کپی مبلغ</button>
        </div>
        <a class="btn btn-success" href="${link}" style="padding: 10px 15px; font-size: 14px; text-decoration: none; color: white; background-color: #28a745; border-radius: 5px;">برو به صفحه پرداخت</a>
    </div>
    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert("مبلغ کپی شد!"))
                .catch(err => alert("خطا در کپی مبلغ: " + err));
        }
    </script>
`;


const awaiting_support_review_form = `
        <form id="model_information_modal">
          <div class="mb-3">
            <label for="model_phone" class="form-label">مدل دستگاه : </label>
            <input type="text" class="form-control" name="model_phone" id="model-phone">
          </div>
          <div class="mb-3">
           <label class="form-label">یک مورد را انتخاب کنید</label>
            <select class="form-select" id="selected-form" name="reason_select" data-width="100%">
                <option selected value="null">یک مورد را انتخاب کنید</option>
            </select>
            </div>
            <div class="mb-3">
            <label type="text" for="text" class="form-label">توضیحات  : </label>
          <textarea name="text" rows="15" class="form-control"></textarea>
          </div>
          <div class="modal-footer">
          <button type="submit" class="btn btn-primary">ثبت</button>
        </div>       
        </form>
    `;

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

const awaiting_send_price_form = `
    <form id="price_modal">
          <div class="mb-3">
                <label class="form-label" for="form-price">بارگزاری فایل</label>
                <input class="form-control" type="text" name="price" id="form-price" multiple>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">ارسال عکس</button>
          </div>       
        </form>
`;


// -------------------------------------------------------------------------------------

const fixedRegistryStatus = (status) => {
    switch (status) {
        case 1:
            return `<span class="badge bg-primary">در انتظار برسی پشتیبان</span>`;

        case 2:
            return `<span class="badge bg-info">در انتظار پرداخت</span>`;
    }
}

const fixedRegistryButton = (status, id, isSupporter) => {
    switch (status) {
        case 1 & isSupporter:
            return `<button id="model_information-${id}" class="btn btn-outline-primary">اعلام مدل</button>`;
        case 2:
            return `<button id="price-${id}" class="btn btn-outline-info paymentPrice" disabled="disabled">میخواهم پرداخت کنم</button>`;
    }
}

function generateRegistryAdminItem(item, isSupporter = false) {
    return `<a href="../../digitall.ui/registry/registry-information.html">
<div class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <div class="d-flex justify-content-between">
                                <div id="registry-box-${item.id}">
                                  <p class="d-none" id="model-${item.id}">${item.model}</p>  
                                  <p class="d-none" id="forWho-${item.id}">${item.forWho}</p>
                                  <p class="d-none" id="summery-${item.id}">${item.summery}</p>
                                  <p class="text-body" id="imei-1-${item.imeI_1}"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                                  ${item.imeI_2 ? `<p class="text-body" id="imei-2-${item.imeI_2}"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                                  <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                                  ${item.phone ? `<p class="text-body" id="phone-${item.phone}"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                                  <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>
                                </div>
                                </a> 
                                <div id="model_information-btn-${item.id}">
                                  ${fixedRegistryButton(item.status, item.id, isSupporter) || ""}                             
                                </div>
                          </div>
                    </div>
                </div>
               `;
}

function generateRegistryItem(item) {
    return `<a href="./registry-information.html?id=${item.id}"
                    class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <p class="text-body"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                          ${item.imeI_2 ? `<p class="text-body"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                          <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                          ${item.phone ? `<p class="text-body"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                          <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>               
                    </div>
                </a>`;
}


$(document).ready(async function (e) {

    await main.showLoading();
    await ready;

    const modals = {
        awaiting_support_review: {
            name: "awaiting-support-review", title: "اعلام مدل", body: awaiting_support_review_form
        },
        awaiting_send_price: {
            name: "awaiting_send_price", title: "درگاه پرداخت", body: awaiting_send_price_form
        },
        show_price_and_link: {
            name: "show_price_and_link", title: "اطلاعات پرداخت", body: ""
        }
    }

    await paymentConnection.on("PaymentUpdated", async (registry) => {
        await main.hideNotificationMessage();
        if (registry.status != 2) {
            await main.hiddenLoading();
            await notificationMessage(warningTitle, "با عرض پوزش درخواست شما رد شده لطفا دوباره برای پرداخت درخواست بدهید", warningTheme);
        } else if (registry.status == 2) {
            modals.show_price_and_link.body = payment_information(registry.price, registry.paymentLink);
            main.generateModal(modals.show_price_and_link.name, modals.show_price_and_link.title, modals.show_price_and_link.body);
            $("#show_price_and_link-modal").css("z-index", 99999999999999);
        }
    })

    let current_page = 1;
    let registries_container = $("#registries-container");

    async function loadRegistries(page) {
        // let data = await registry.getRegistryApi("RejectionReasons/predefined");
        let {entities} = await registry.getRegistryApi(`${supporter ? 'Registry/get-all' : 'Registry'}?page=${page}`, false);

        await $.each(entities, async function (index, registry) {
            registries_container.append(generateRegistryAdminItem(registry, supporter));

            $(`#model_information-${registry.id}`).on("click", async function (e) {
                main.generateModal(modals.awaiting_support_review.name, modals.awaiting_support_review.title, modals.awaiting_support_review.body);

                let form = $("#model_information_modal");
                let input = $(`<input class="d-none" type="text" value="${e.target.id.replace("model_information-", "")}" />`);
                $(form).append(input);

                let dropdown = $('#selected-form');

                // data.forEach(item => {
                //     dropdown.append(`<option value="${item.id}">${item.reason}</option>`);
                // });

                await submit_model_information_modal();
            });
        });

        let supporters = await supporterOnlineConnection.invoke('GetOnlineSupporterAsync');

        $(".paymentPrice").prop("disabled", supporters.length === 0);

        $(".paymentPrice").on("click", async function (e) {
            const id = +e.target.id.split("-")[1];
            const registry_box = $(`#registry-box-${id}`);
            let imeI_1 = registry_box.find('[id^="imei-1-"]')[0].id.split("-")[2];
            let imeI_2 = registry_box.find('[id^="imei-2-"]')[0].id.split("-")[2] || null;
            let summery = $(`#summery-${id}`).html() || null;
            let forWho = $(`#forWho-${id}`).html() || null;
            let model = $(`#model-${id}`).html() || null;
            let phone = registry_box.find('[id^="phone-"]')[0].id.split("-")[1];

            const data = {
                id, imeI_1, imeI_2, summery, forWho, phone, model
            };

            await main.notificationMessage(
                "در حال بررسی قیمت...", "لطفاً تا زمان اعلام قیمت منتظر بمانید. در صورت ترک این صفحه، ممکن است قیمت نهایی اعلام نشود.", main.infoTheme, 360000, false);
            await main.showLoading();
            await registry.registerPayment(data);
        });

    }

    await loadRegistries(current_page);

    await main.hiddenLoading();
});


// ----------------------------------------------- forms

async function submit_model_information_modal() {
    await $("#model_information_modal").validate({
        rules: {
            model_phone: {
                required: true
            },

        }, messages: {
            model_phone: {
                required: "مدل دستگاه نمیتواند خالی باشد ."
            },
        }, submitHandler: async function (form, event) {
            event.preventDefault();

            let hiddenInput = $(form).find('input.d-none');
            let model = $(form).find('input#model-phone').val();
            let id = hiddenInput.val();

            let data = {model, id}

            registry.updateRegistryApi("Registry/Decision", data);
            main.destroidModal("awaiting-support-review");
        }, errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");

            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                error.insertAfter(element.parent().parent());
            } else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.appendTo(element.parent().parent());
            } else {
                error.insertAfter(element);
            }
        }, highlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        }, unhighlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        }
    });
}

// async function submit_price_modal() {
//     await $("#price_modal").validate({
//         rules: {
//             price: {
//                 required: true,
//             },
//         }, messages: {
//             price: {
//                 required: "فایل نمیتواند خالی باشد .",
//             },
//         }, submitHandler: function (form) {
//         }, errorPlacement: function (error, element) {
//             error.addClass("invalid-feedback");
//
//             if (element.parent('.input-group').length) {
//                 error.insertAfter(element.parent());
//             } else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
//                 error.insertAfter(element.parent().parent());
//             } else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
//                 error.appendTo(element.parent().parent());
//             } else {
//                 error.insertAfter(element);
//             }
//         }, highlight: function (element, errorClass) {
//             if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
//                 $(element).addClass("is-invalid").removeClass("is-valid");
//             }
//         }, unhighlight: function (element, errorClass) {
//             if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
//                 $(element).addClass("is-valid").removeClass("is-invalid");
//             }
//         }
//     });
// }
