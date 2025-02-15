import {showLoading, hiddenLoading, getDigitallApi, component_access, updateDigitallApi} from "./main.js";


$(document).ready(async function () {

    showLoading();

    if ($("#edit-form").length) {
        await component_access("edit_form");
        showEditForm()
    }
    if ($("#submit-agent").length) {
        await component_access("submit_agent");
        ShowSubmitForm()
    }
    hiddenLoading();
});

let brand_name, agent_code, agent_percent, user_percent, card_holder_name,
    card_number, maximum_amount_for_agent, minimal_amount_for_agent,
    maximum_amount_for_user, minimal_amount_for_user;

function details() {
    brand_name = $("#brand-name");
    agent_code = $("#agent-code");
    agent_percent = $("#agent-percent");
    user_percent = $("#user-percent");
    card_holder_name = $("#card-holder-name");
    card_number = $("#card-number");
    maximum_amount_for_agent = $("#maximum-amount-for-agent");
    minimal_amount_for_agent = $("#minimal-amount-for-agent");
    maximum_amount_for_user = $("#maximum-amount-for-user");
    minimal_amount_for_user = $("#minimal-amount-for-user");
}


function showEditForm() {
    details();

    getDigitallApi("/Agent/AgencyInformation", false).then((data) => {
        brand_name.val(data.brandName);
        agent_code.val(data.agentCode);
        agent_percent.val(data.agentPercent);
        user_percent.val(data.userPercent);
        card_holder_name.val(data.cardHolderName);
        card_number.val(data.cardNumber);
        maximum_amount_for_agent.val(data.maximumAmountForAgent);
        minimal_amount_for_agent.val(data.minimalAmountForAgent);
        maximum_amount_for_user.val(data.maximumAmountForUser);
        minimal_amount_for_user.val(data.minimalAmountForUser);
    });
}


function ShowSubmitForm() {
    details();

    const edit_form = $("#edit-form");

    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            const re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "⚠️ لطفاً ورودی معتبر وارد کنید."
    );

    edit_form.validate({
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

            showLoading();

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
            };

            await updateDigitallApi("/Agent/Update", obj);
            window.location.href = "index.html";
            hiddenLoading();
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
            if ($(element).prop('type') !== 'checkbox' && $(element).prop('type') !== 'radio') {
                $(element).addClass("is-invalid").removeClass("is-valid");
            }
        },
        unhighlight: function (element, errorClass) {
            if ($(element).prop('type') !== 'checkbox' && $(element).prop('type') !== 'radio') {
                $(element).addClass("is-valid").removeClass("is-invalid");
            }
        }
    });
}
