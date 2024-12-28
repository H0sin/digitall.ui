import * as api from "./main.js";

let brand_name = $("#brand-name");
let agent_code = $("#agent-code");
let agent_percent = $("#agent-percent");
let user_percent = $("#user-percent");
let card_holder_name = $("#card-holder-name");
let card_number = $("#card-number");
let maximum_amount_for_agent = $("#maximum-amount-for-agent");
let minimal_amount_for_agent = $("#minimal-amount-for-agent");
let maximum_amount_for_user = $("#maximum-amount-for-user");
let minimal_amount_for_user = $("#minimal-amount-for-user");

$(document).ready(async function () {
    await api.getDigitallApi("/Agent/AgencyInformation" , false).then(( data ) => {
        $(brand_name).val(data.brandName);
        $(agent_code).val(data.agentCode);
        $(agent_percent).val(data.agentPercent);
        $(user_percent).val(data.userPercent);
        $(card_holder_name).val(data.cardHolderName);
        $(card_number).val(data.cardNumber);
        $(maximum_amount_for_agent).val(data.maximumAmountForAgent);
        $(minimal_amount_for_agent).val(data.minimalAmountForAgent);
        $(maximum_amount_for_user).val(data.maximumAmountForUser);
        $(minimal_amount_for_user).val(data.minimalAmountForUser);
    });
});

$(async function () {
    'use strict';

    const edit_form = $("#edit-form");

    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            const re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "⚠️ لطفاً ورودی معتبر وارد کنید."
    );

    $(async function () {
        await edit_form.validate({
            rules: {
                brand: {
                    required: true,
                    minlength: 3,
                    maxlength: 9,
                    regex: /^[a-zA-Z0-9_]+$/,
                },
                agentPercent: {
                    required: true,
                    number: true,
                    range: [0, 75],
                },
                userPercent: {
                    required: true,
                    number: true,
                    range: [0, 500],
                },
                cardNumber: {
                    minlength: 16,
                    maxlength: 16,
                    number: true,
                },
                cardHolderName: {
                    minlength: 4,
                    maxlength: 60,
                    required: true
                }
            },
            messages: {
                brand: {
                    required: "لطفا نام خود را وارد کنید",
                    minlength: "نام نباید کمتر از 3 کاراکتر باشد",
                    maxlength: "نام نباید بیشتر از 9 کاراکتر باشد",
                    regex: "نام نمایندگی فقط می‌تواند شامل حروف انگلیسی، اعداد و آندرلاین باشد.",
                },
                agentPercent: {
                    required: "درصد نمایندگی نمیتواند خالی باشد",
                    number: "درصد نمایندگی حتما باید عدد باشد",
                    range: "درصد نمایندگی باید بین 0 و 75 باشد",
                },
                userPercent: {
                    required: "درصد نمایندگی نمیتواند خالی باشد",
                    number: "درصد نمایندگی حتما باید عدد باشد",
                    range: "درصد نمایندگی باید بین 0 و 500 باشد",
                },
                cardNumber: {
                    minlength: "شماره کارت اشتباه است",
                    maxlength: "شماره کارت اشتباه است",
                    number: "شماره کارت اشتباه است",
                },
                cardHolderName: {
                    minlength: "نام صاحب کارت نباید کمتر از 4 کاراکتر باشد",
                    maxlength: "نام صاحب کارت نباید بیشتر از 60 کاراکتر باشد",
                    required: "نمیتواند نام صاحب کارت خالی باشد"
                }
            },
            submitHandler: async function (form, event) {
                event.preventDefault();
                await api.showLoading();

                let obj = {
                    brandName: brand_name.val(),
                    agentPercent: agent_percent.val(),
                    userPercent: user_percent.val(),
                    cardHolderName: card_holder_name.val(),
                    cardNumber: card_number.val(),
                    maximumAmountForAgent: maximum_amount_for_agent.val(),
                    minimalAmountForAgent: minimal_amount_for_agent.val(),
                    maximumAmountForUser: maximum_amount_for_user.val(),
                    minimalAmountForUser: minimal_amount_for_user.val(),
                }

                await api.updateDigitallApi("/Agent/Update", obj)

                window.location.href = "index.html"

                await api.hiddenLoading();
            },
            errorPlacement: function (error, element) {
                error.addClass("invalid-feedback");

                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                }
                else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                    error.insertAfter(element.parent().parent());
                }
                else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                    error.appendTo(element.parent().parent());
                }
                else {
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

});

