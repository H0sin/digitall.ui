import * as main from "./main.js";
import {autoNotification} from "./main.js";

let ready = $(document).ready(async function () {

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
                required: "فیلد اجباری است",
                maxlength: "imei دستگاه حتما 16 رقم است",
                minlength: "imei دستگاه حتما 16 رقم است",
                number: "نمیتوانید از کاراکتر استفاده کنید",
            },
            imei_2: {
                maxlength: "imei دستگاه حتما 16 رقم است",
                minlength: "imei دستگاه حتما 16 رقم است",
                number: "نمیتوانید از کاراکتر استفاده کنید",
            },
            accept_the_rules: {
                required:"فیلد اجباری است"
            },
            summery: {
                maxlength: "بیشتر از 500 کاراکتر نمیتواند باشد",
            },
            for_who:{
                maxlength : "بیشتر از 50 کاراکتر نمیتواند باشد"
            },
            phone:{
                required: "فیلد اجباری است",
                maxlength: "فرمت اشتباه است",
                minlength: "فرمت اشبتباه است",
                number: "فرمت اشبتباه است",
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await main.showLoading();

            var data = {
                imei_1 : imei_1.val(),
                imei_2 : imei_2.val(),
                accept_the_rules : accept_the_rules.val(),
                summery : summery.val().trim(),
                for_who : for_who.val().trim(),
                phone : phone.val(),
            }

            let {isSuccess,message,statusCode} = await main.postDigitallApi("/Registry/Add",data);

            main.autoNotification(statusCode,isSuccess,message);

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