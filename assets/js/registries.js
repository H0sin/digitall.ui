import * as registry from "./main-registry.js";
import { warningTheme , warningTitle ,infoTheme, generateModal, notificationMessage, showLoading, hiddenLoading , destroidModal, hideNotificationMessage} from "./main.js";
import {ready,paymentConnection,supporter, getRegistryApi ,supporterOnlineConnection,fixedRegistryStatus } from "./main-registry.js";


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
    </script>`;

const awaiting_support_review_form = `
        <form id="model_information_modal">
          <div class="mb-3">
            <label for="model_phone" class="form-label">مدل دستگاه : </label>
            <input type="text" class="form-control" name="model_phone" id="model-phone">
          </div>
          <div class="mb-3">
           <label class="form-label">یک مورد را انتخاب کنید</label>
            <select class="form-select" id="predefinedRejectionReason" name="reason_select" data-width="100%">
                <option selected value="null">یک مورد را انتخاب کنید</option>
            </select>
            </div>
            <div class="mb-3">
            <label for="additionalExplanation" class="form-label">توضیحات  : </label>
            <textarea name="additionalExplanation" id="additionalExplanation"  rows="15" class="form-control"></textarea>
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
        </form>`;

// -------------------------------------------------------------------------------------

const fixedRegistryButton = (status, id, isSupporter) => {
    switch (status) {
        case 1 & isSupporter:
            return `<button id="model_information-${id}" class="btn btn-outline-primary">اعلام مدل</button>`;
        case 2:
            return `<button id="price-${id}" class="btn btn-outline-info paymentPrice" disabled="disabled">میخواهم پرداخت کنم</button>`;
        case 3:
            return `<button id="edite-registry-${id}" class="btn btn-outline-danger">ویرایش اطلاعات</button>`;
        // case 5:
        //     return `<button id="${id}" class="btn btn-outline-success">اطلاعات گمرک ثبت شده</button>`;
    }
}

// todo creat modal
function generateRegistryAdminItem(item, isSupporter = false) {
    return `<div class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <div class="d-flex justify-content-between">
                          <a href="registry-information.html?id=${item.id}">
                                <div id="registry-box-${item.id}">
                                  <p class="d-none" id="model-${item.id}">${item.model}</p>  
                                  <p class="d-none" id="forWho-${item.id}">${item.forWho}</p>
                                  <p class="d-none" id="summery-${item.id}">${item.summery}</p>
                                  <p class="text-body" id="imei-1-${item.imeI_1}"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                                  ${item.imeI_2 ? `<p class="text-body" id="imei-2-${item.imeI_2}"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                                  <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                                  ${item.status == 3 ? `<p class="text-body mb-2"><span class="text-muted tx-13"> علت :</span>${item.reason}</p>` : ""}
                                  ${(item.status == 3 && item.additionalExplanation != null) ? `<p class="text-body mb-2"><span class="text-muted tx-13"> توضیحات رد شده :</span>${item.additionalExplanation}</p>` : ""}
                                  ${item.phone ? `<p class="text-body" id="phone-${item.phone}"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                                  <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>
                                </div> 
                          </a>
                                <div id="model_information-btn-${item.id}">
                                  ${fixedRegistryButton(item.status, item.id, isSupporter) || ""}                             
                                </div>
                          </div>
                    </div>
                </div>`;
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

    await showLoading();
    await ready;

    let current_page = 1;
    let registries_container = $("#registries-container");
    let registry_status = "null";
    let allEntitiesCount = 0;
    let imei_filter = "null";
    let debounce_timeout;

    $("#registry-status").on("change", async function (e) {
        registry_status = e.target.value;
        await showLoading();
        current_page = 1;
        registries_container.html('');
        await loadRegistries(current_page);
        await hiddenLoading();
    });

    $("#imei-filter").on("input", function (event) {
        imei_filter = event.target.value.trim();
        clearTimeout(debounce_timeout);

        debounce_timeout = setTimeout(async () => {
            current_page = 1;
            registries_container.html('');
            await showLoading();
            await loadRegistries(current_page);
            await hiddenLoading();
        }, 500);
    });

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
        await hideNotificationMessage();

        if (registry.status != 2) {
            await hiddenLoading();
            await notificationMessage(warningTitle, "با عرض پوزش درخواست شما رد شده لطفا دوباره برای پرداخت درخواست بدهید", warningTheme);
        } else if (registry.status == 2) {
            modals.show_price_and_link.body = payment_information((+registry.price + +registry.profit), registry.paymentLink);
            generateModal(modals.show_price_and_link.name, modals.show_price_and_link.title, modals.show_price_and_link.body);
            $("#show_price_and_link-modal").css("z-index", 99999999999999);
        }
    })


    async function loadRegistries(page) {
        let {
            allEntitiesCount: counts,
            entities
        } = await getRegistryApi(`${supporter ? 'Registry/get-all' : 'Registry'}?takeEntity=8&page=${page}${registry_status != "null" ? `&status=${registry_status}`  : ""}${imei_filter != "null" ? `&imei=${imei_filter}` : ""}`, false);
        allEntitiesCount = counts;
        if (allEntitiesCount === 0) {
            registries_container.append("<h4 class='text-center p-4'>موردی یافت نشد</h4>");
        } else {
            await $.each(entities, async function (index, registry) {
                registries_container.append(generateRegistryAdminItem(registry, supporter));

                $(`#model_information-${registry.id}`).on("click", async function (e) {

                    generateModal(modals.awaiting_support_review.name, modals.awaiting_support_review.title, modals.awaiting_support_review.body);

                    let predefined = await getRegistryApi("RejectionReasons/predefined");
                    let dropdown = $('#predefinedRejectionReason');

                    predefined.map(x => dropdown.append(`<option value="${x.id}">${x.reason}</option>`));

                    let form = $("#model_information_modal");

                    let input = $(`<input class="d-none" type="text" value="${e.target.id.replace("model_information-", "")}" />`);

                    $(form).append(input);

                    await submit_model_information_modal();
                });

            });
        }
        let supporters = await supporterOnlineConnection.invoke('GetOnlineSupporterAsync');

        $(".paymentPrice").prop("disabled", supporters.length === 0);

        $(".paymentPrice").on("click", async function (e) {
            const id = +e.target.id.split("-")[1];
            const registry_box = $(`#registry-box-${id}`);
            let imeI_1 = registry_box.find('[id^="imei-1-"]')[0].id.split("-")[2];
            let imeI_2 = registry_box.find('[id^="imei-2-"]')[0]?.id?.split("-")[2] || null;
            let summery = $(`#summery-${id}`).html() || null;
            let forWho = $(`#forWho-${id}`).html() || null;
            let model = $(`#model-${id}`).html() || null;
            let phone = registry_box.find('[id^="phone-"]')[0]?.id?.split("-")[1] || null;

            const data = {
                id, imeI_1, imeI_2, summery, forWho, phone, model
            };

            await notificationMessage(
                "در حال بررسی قیمت...", "لطفاً تا زمان اعلام قیمت منتظر بمانید. در صورت ترک این صفحه، ممکن است قیمت نهایی اعلام نشود.", infoTheme, 360000, false);
            await showLoading();
            await registry.registerPayment(data);
        });

        $('[id^="edite-registry-"]').on("click", async function (e) {
            window.location.href = `edit-registry.html?id=${e.currentTarget.id.split("-")[2]}`
        });

    }

    await loadRegistries(current_page);

    registries_container.on("scroll", async function () {
        const container = $(this);
        const scrollHeight = container[0].scrollHeight;
        const scrollTop = container.scrollTop();
        const containerHeight = container.height();

        if (scrollTop + containerHeight >= scrollHeight - 10) {
            if ($("#registries-container > div").length >= allEntitiesCount) {
                return;
            }
            current_page++;
            await showLoading();
            await loadRegistries(current_page);
            await hiddenLoading();
        }
    });

    // ----------------------------------------------- forms

    async function submit_model_information_modal() {
        await $("#model_information_modal").validate({
            rules: {
                model_phone: {
                    required: function (element) {
                        return $("#predefinedRejectionReason").val() === "null";
                    }
                },
            },
            messages: {
                model_phone: {
                    required: "مدل دستگاه نمیتواند خالی باشد."
                },

            }, submitHandler: async function (form, event) {
                event.preventDefault();

                let hiddenInput = $(form).find('input.d-none');
                let model = $(form).find('input#model-phone').val();
                let id = hiddenInput.val();
                let predefinedRejectionReasonId = +$("#predefinedRejectionReason").val();
                let additionalExplanation = $("#additionalExplanation").val();
                let data = {id, model, predefinedRejectionReasonId, additionalExplanation}

                await registry.updateRegistryApi("Registry/Decision", data);
                await loadRegistries(current_page);
                destroidModal("awaiting-support-review");

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

    await hiddenLoading();
});

