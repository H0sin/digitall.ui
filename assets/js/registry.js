import * as registry from "./main-registry.js";
import * as main from "./main.js";


$(document).ready(async function () {

    let registry_token = localStorage.getItem("registry-token");

    if (!registry_token) await registry.postRegistryUserApi();

    let imei_1 = $("#imei_1");
    let imei_2 = $("#imei_2");
    let accept_the_rules = $("#accept_the_rules");
    let summery = $("#summery");
    let for_who = $("#for_who");
    let phone = $("#phone");


    await $("#accept-registry-form").validate({
        rules: {
            imei_1: {
                required: true,
                number: true,
                maxlength: 16,
                minlength:16
            },
            imei_2: {
                number: true,
                maxlength: 16,
                minlength:16
            },
            accept_the_rules: {
                required:true
            },
            summery: {
                maxlength: 500,
            },
            for_who:{
                maxlength: 100
            },
            phone: {
                required: true,
                number: true,
                minlength: 11,
                maxlength: 11
            }
        },
        messages: {
            imei_1: {
                required: "IMEI دستگاه نمیتواند خالی باشد",
                maxlength: "IMEI دستگاه حتما 16 رقم است",
                minlength: "IMEI دستگاه حتما 16 رقم است",
                number: "نمیتوانید از کاراکتر استفاده کنید",
            },
            imei_2: {
                maxlength: "IMEI دستگاه حتما 16 رقم است",
                minlength: "IMEI دستگاه حتما 16 رقم است",
                number: "نمیتوانید از کاراکتر استفاده کنید",
            },
            accept_the_rules: {
                required:"لطفا قوانین و مقررات را بپذیرید"
            },
            summery: {
                maxlength: "بیشتر از 500 کاراکتر نمیتواند باشد",
            },
            for_who:{
                maxlength : "بیشتر از 50 کاراکتر نمیتواند باشد"
            },
            phone:{
                required: "شماره تماس نمیتواند خالی باشد",
                maxlength: "فرمت اشتباه است",
                minlength: "فرمت اشتباه است",
                number: "فرمت اشتباه است",
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await main.showLoading();

            const data = {
                imeI_1 : imei_1.val(),
                imeI_2 : imei_2.val() || null,
                acceptTheRules : true,
                summery : summery.val().trim(),
                forWho : for_who.val().trim(),
                phone : phone.val(),
            };

            await registry.postRegistryApi("/Registry",data);

            window.location.href = "registries.html";

            await main.hiddenLoading();
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
});

