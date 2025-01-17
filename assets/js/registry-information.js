import {gregorianToJalali, hiddenLoading, showLoading} from "./main.js";
import {getRegistryApi, ready, supporter, fixedRegistryStatus, updateRegistryApi} from "./main-registry.js";

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

    await hiddenLoading();

//----------------------------------------G E N E R A T E - - B T N-------------------------------------------------
    const btnAction = $("<div class='col btn-group mt-3 w-100'></div>");
    const statusModalBtn = $(`<button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#statusModal">تغییر وضعیت</button>`);
    const informationModalBtn = $(`<button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#informationModal">ارسال اطلاعات</button>`);

    const statusModalFooter = $("#statusModal .footer-status");
    statusModalFooter.empty();
    statusModalFooter.append(`
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
        <button type="submit" class="btn btn-primary">ثبت وضعیت</button>
    `);

    const informationModalFooter = $("#informationModal .footer-information");
    informationModalFooter.empty();
    informationModalFooter.append(`
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
        <button type="submit" class="btn btn-success">ارسال اطلاعات</button>
    `);

    btnAction.append(statusModalBtn);
    $("#informationRegistry").append(btnAction);

    if (registry.status === 1) {
        btnAction.append(informationModalBtn);
    }

    if ($('#flatpickr-date').length) {
        flatpickr("#flatpickr-date", {
            wrap: true,
        });
    }


    $("#information-form").validate({
        rules: {
            travelerNational: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 10,
            },
            travelerPhone: {
                required: true,
                number: true,
                minlength: 11,
                maxlength: 11,
            },
            customsIBAN: {
                required: true,
                minlength: 24,
            },
            customsPayment: {
                number: true,
            },
            customsAmount: {
                number: true,
                required: true
            }
        },
        messages: {
            travelerNational: {
                required: "لطفا کدملی خود را وارد کنید",
                minlength: "کدملی نباید کمتر از 10 کاراکتر باشد",
                maxlength: "کدملی نباید بیشتر از 10 کاراکتر باشد",
            },
            travelerPhone: {
                required: "شماره مبایل خود را وارد کنید",
                number: "شماره مبایل حتما باید عدد باشد",
                minlength: "شماره مبایل نباید کمتر از 11 کاراکتر باشد",
                maxlength: "شماره مبایل نباید بیشتر از 11 کاراکتر باشد",
            },
            customsIBAN: {
                required: "شماره شباء گمرک را وارد کنید",
                minlength: "شماره شباء گمرک نباید کمتر از 24 کاراکتر باشد",
            },
            customsPayment: {
                number: "شناسه پرداخت  حتما باید عدد باشد ",
            },
            customsAmount: {
                number: "مبلغ گمرک  حتما باید عدد باشد ",
                required: "مبلغ گمرک نمیتواند خالی باشد"
            }
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
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            let obj = {
                id: +id,
                travelerNationalId: $("#travelerNational").val(),
                travelerPhone: $("#travelerPhone").val(),
                travelerBirthDate: $('#flatpickr-date input').val(),
                customsIBAN: $("#customsIBAN").val(),
                customsPaymentId: $("#customsPayment").val(),
                customsAmount: +$("#customsAmount").val(),
            };

            await updateRegistryApi(`Registry/registry-customs`, obj);


        }
    });

})();
