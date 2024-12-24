import * as registry from "./main-registry.js";
import * as main from "./main.js";

// -------------------------------------------------------------------------------------

const awaiting_support_review_form = `
        <form id="price_modal">
          <div class="mb-3">
            <label for="price" class="form-label">قیمت دستگاه :</label>
            <input name="price" type="text" class="form-control" id="price">
          </div>
          <div class="mb-3">
            <label for="model-phone" class="form-label">مدل دستگاه : </label>
            <input type="text" class="form-control" id="model-phone">
          </div>
          <div class="modal-footer">
          <button type="submit" class="btn btn-primary">ارسال</button>
        </div>       
        </form>
    `;

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

const awaiting_send_image_form =`
    <form id="image_modal">
          <div class="mb-3">
                <label class="form-label" for="form-image">بارگزاری فایل</label>
                <input class="form-control" type="file" name="image" id="form-image" multiple>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">ارسال عکس</button>
          </div>       
        </form>
`;



// -------------------------------------------------------------------------------------


const fixedRegistryStatus = (status) => {
    switch (status) {
        case 0:
            return `<span class="badge bg-primary">در انتظار برسی پشتیبان</span>`;

            case 1:
                return `<span class="badge bg-info">در انتظار ارسال فایل</span>`;
    }
}

const fixedRegistryButton = (status, id) => {
    switch (status) {
        case 0:
            return `<button id="price-${id}" class="btn btn-outline-primary">اعلام قیمت و مدل</button>
                    
            `;
        case 1:
            return `
                    <button id="image-${id}" class="btn btn-outline-primary">بارگزاری عکس</button>
            `;


    }
}

function generateRegistryAdminItem(item) {
    return `<div class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <div class="d-flex justify-content-between">
                                <div>
                                  <p class="text-body"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                                  ${item.imeI_2 ? `<p class="text-body"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                                  <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                                  ${item.phone ? `<p class="text-body"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                                  <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>
                                </div>
                                <div id="price-btn-${item.id}">
                                  ${fixedRegistryButton(item.status, item.id)}                             
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
    await main.showLoading();

    const modals = {
        awaiting_support_review: {
            name: "awaiting-support-review",
            title: "اعلام قیمت و مدل",
            body: awaiting_support_review_form
        },
        awaiting_send_image:{
            name: "awaiting_send_image",
            title: "بارگزاری عکس",
            body: awaiting_send_image_form
        },
    }

    let current_page = 1;
    let registries_container = $("#registries-container");

    async function loadRegistries(page) {
        let {statusCode, data} = await registry.getRegistryApi("/Registry");

        if (statusCode != 403) {
            await $.each(data.entities, async function (index, registry) {
                registries_container.append(generateRegistryAdminItem(registry));

                $(`#price-${registry.id}`).on("click",async function (e) {
                    main.generateModal(modals.awaiting_support_review.name, modals.awaiting_support_review.title, modals.awaiting_support_review.body);

                    let form = $("#price_modal");
                    let input = $(`<input class="d-none" type="text" value="${e.target.id.replace("price-","")}" />`);
                    $(form).append(input);

                    await submit_price_modal();
                });

                $(`#image-${registry.id}`).on("click",async function (e) {
                   main.generateModal(modals.awaiting_send_image.name, modals.awaiting_send_image.title, modals.awaiting_send_image.body);
                   await submit_image_modal();
                });

            });

        } else if (statusCode == 403) {
            let {statusCode, data} = await registry.getRegistryApi("/Registry");
            await $.each(data.entities, async function (index, registry) {

                registries_container.append(generateRegistryItem(registry));

                $(".btn-outline-primary").on("click", function (e) {
                    main.generateModal(modals.awaiting_support_review.name, modals.awaiting_support_review.title, modals.awaiting_support_review.body);
                });
            });
        }
    }

    await loadRegistries(current_page);

    await main.hiddenLoading();
});


// ----------------------------------------------- forms

async function submit_price_modal(){
    await $("#price_modal").validate({
        rules: {
            price: {
                required: true,
                number: true
            },
        },
        messages: {
            price: {
                required: "مبلغ نمیتواند خالی باشد .",
                number: " مبلغ باید عدد باشد ."
            },
        },
        submitHandler:async function (form,event) {
            event.preventDefault();

            let hiddenInput = $(form).find('input.d-none');
            let model = $(form).find('input#model-phone').val();
            let price = $(form).find('input#price').val();
            let id = hiddenInput.val();

            let data = {
                model,
                price,
                id
            }

            let {isSuccess,message,statusCode} = await registry.updateRegistryApi("/Registry",data);

            main.autoNotification(statusCode,isSuccess,message);
        },
        errorPlacement: function (error, element) {
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
        },
        highlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        },
        unhighlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        }
    });
}

async function submit_image_modal(){
    await $("#image_modal").validate({
        rules: {
            image: {
                required: true,
            },
        },
        messages: {
            image: {
                required: "فایل نمیتواند خالی باشد .",
            },
        },
        submitHandler: function (form) {
            },
        errorPlacement: function (error, element) {
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
        },
        highlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        },
        unhighlight: function (element, errorClass) {
            if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        }
    });
}
