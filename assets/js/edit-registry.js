import * as registry from "./main-registry.js";
import * as main from "./main.js";
import {getRegistryApi, updateRegistryApi} from "./main-registry.js";
import {infoTheme, infoTitle, notificationMessage} from "./main.js";

'use strict'

$(document).ready(async function () {
    let for_who = $("#for-who");
    let edit_phone = $("#edit-phone");
    let imei_1 = $("#imei-1");
    let imei_2 = $("#imei-2");
    let edit_summery = $("#edit-summery");
    let acceptRegistryForm = $("#accept-registry-form");

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const id = params.get('id');

    await getRegistryApi(`Registry/GetRegistryById/${id}`).then((data) => {
        if (data) {
            for_who.val(data.forWho);
            edit_phone.val(data.phone);
            imei_1.val(data.imeI_1);
            imei_2.val(data.imeI_2);
            edit_summery.val(data.summery);
        }
    });

    $(async function () {
        await acceptRegistryForm.validate({
            rules: {
                imei_1: {
                    required: true,
                    number: true,
                    maxlength: 16,
                    minlength: 16
                },
                imei_2: {
                    number: true,
                    maxlength: 16,
                    minlength: 16
                },
                summery: {
                    maxlength: 500,
                },
                for_who: {
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
                summery: {
                    maxlength: "بیشتر از 500 کاراکتر نمیتواند باشد",
                },
                for_who: {
                    maxlength: "بیشتر از 100 کاراکتر نمیتواند باشد"
                },
                phone: {
                    required: "شماره تماس نمیتواند خالی باشد",
                    maxlength: "فرمت اشتباه است",
                    minlength: "فرمت اشتباه است",
                    number: "فرمت اشتباه است",
                }
            },
            errorPlacement: function (error, element) {
                error.addClass("invalid-feedback");

                if (element.prop('type') === 'checkbox') {
                    error.insertAfter(element.next('label'));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element) {
                $(element).addClass("is-invalid").removeClass("is-valid");
            },
            unhighlight: function (element) {
                $(element).addClass("is-valid").removeClass("is-invalid");
            },
            submitHandler: async function (form, event) {
                event.preventDefault();


                let obj = {
                    id: id,
                    forWho: for_who.val(),
                    phone: edit_phone.val(),
                    imeI_1: imei_1.val(),
                    imeI_2: imei_2.val() || null,
                    summery: edit_summery.val() || null,
                };

                await updateRegistryApi("Registry", obj);
                setInterval( ()=> window.location.href = "registries.html",2500);
            }
        });
    });
});
