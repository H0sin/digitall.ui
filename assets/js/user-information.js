import * as api from "./main.js";
import {component_access, transactionImagePath, updateDigitallApi} from "./main.js";

'use strict'

$(document).ready(async function () {
    await api.showLoading();
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const id = params.get("id");
    const increase_user_balance_description = $("#increase-user-balance-description");
    const increase_user_balance = $("#increase-user-balance");
    const decrease_user_balance_description = $("#decrease-user-balance-description");
    const decrease_user_balance = $("#decrease-user-balance");
    const card_to_card_payment = $("#cardToCardPayment");
    const message_text = $("#message-text");
    const special_percent = $("#specialPercent");
    const description_text = $("#description-text");


    let user = {};

    function generateButton({
                                text = 'ارسال پیام به کاربر',
                                classes = 'col-6',
                                btnEvent = null,
                                dataBsTarget = null,
                                isActive = true
                            }) {

        if (isActive) {
            const parent = $(`<div class="${classes}"></div>`);

            const btn = $(`<button 
              type="button" 
              class="btn btn-outline-primary w-100" 
              ${dataBsTarget ? `data-bs-toggle="modal" data-bs-target="${dataBsTarget}"` : ''}>
              ${text}
            </button>`);

            if (btnEvent)
                $(btn).on('click', function () {
                    btnEvent();
                });

            parent.append(btn);

            return parent;
        }

        return;
    }


    const btns = {
        increaseBalance: {
            text: "افزایش موجودی",
            dataBsTarget: "#increaseModal"
        },
        decreaseBalance: {
            text: "کاهش موجودی",
            dataBsTarget: "#decreaseModal"
        },
        sendMessage: {
            text: "ارسال پیام به کاربر",
            dataBsTarget: "#sendMassegeModal"
        },
        blocked: {
            btnEvent: async () => await $.changeBlockStatus()
        },
        cardToCardPayment: {
            classes: "col-12",
            btnEvent: async () => await $.changeCardToCardPaymentStatus()
        },
        convertToAgent: {
            text: "نماینده کردن کاربر",
            classes: "col-12",
            btnEvent: async () => await $.representTheUser(),
        },
        specialPercent: {
            text: "گذاشتن درصد ویژه برای نماینده",
            classes: "col-12",
            dataBsTarget: "#percentageModal"
        },
        agencyInformation: {
            text: "اطلاعات نمایندگی",
            classes: "col-12",
            isActive: false,
            dataBsTarget: "#agencyInformationModal"
        },
        transaction: {
            text: "تراکنش ها",
            classes: "col-12",
            isActive: true,
            btnEvent: async () => window.location.href = "transaction.html",
        },
        roles: {
            text: "نقش ها",
            isActive: true,
            btnEvent: async () => window.location.href = "roles.html",
        },
        permissions: {
            text: "دسترسی های کاربر",
            isActive: true,
            btnEvent: async () => window.location.href = "permissions.html",
        },
        description: {
            text: "افزودن توضیحات",
            classes: "col-12",
            isActive: true,
            dataBsTarget: "#descriptionModal"
        }
    }

    //----------------------------------- user update -------------------------------------------

    $.representTheUser = async () => {
        await api.showLoading();

        let data = {
            agentAdminId: user.id
        }

        await api.postDigitallApi("/Agent/AddAgent", data);

        await $.getUserInformation();

        await api.hiddenLoading();
    }

    $.changeCardToCardPaymentStatus = async () => {
        await api.showLoading();

        let data = {
            id: user.id,
            isBlocked: user.isBlocked,
            cardToCardPayment: !user.cardToCardPayment,
            description: description_text.val(),
        }

        await api.updateDigitallApi("/User/UpdateUser", data);

        await $.getUserInformation();

        await api.hiddenLoading();
    }

    $.changeBlockStatus = async () => {
        await api.showLoading();

        let data = {
            id: user.id,
            isBlocked: !user.isBlocked,
            cardToCardPayment: user.cardToCardPayment,
            description: description_text.val()
        };

        await api.updateDigitallApi("/User/UpdateUser", data);

        await $.getUserInformation();

        await api.hiddenLoading();
    }

    $.setAgencyInformation = async (agent) => {
        $("#agent-id").html("ایدی نماینده : " + agent.id || "ثبت نشده");
        $("#disabled-account-time").html("اکانت : " + (agent.disabledAccountTime ? "غیر فعال" : "فعال"));
        $("#agent-code").html("ایدی عددی نماینده : " + agent.agentCode || "ثبت نشده");
        $("#brand-name-agent").html("نام نماینده  : " + agent.brandName || "ثبت نشده");
        $("#persian-brand-name").html("نام نماینده  : " + agent.persianBrandName || "ثبت نشده");
        $("#agent-admin-id").html("ایدی نمایندگی : " + agent.agentAdminId || "ثبت نشده");
        $("#brand-address").html("ادرس نماینده : " + (agent.brandAddress ? "null" : "ثبت نشده"));
        $("#agent-percent").html("درصد نماینده ها : " + agent.agentPercent || "ثبت نشده");
        $("#user-percent").html("درصد کاربران : " + agent.userPercent || "ثبت نشده");
        $("#special-percent").html("درصد ویژه برای نماینده : " + agent.specialPercent || "ثبت نشده");
        $("#amount-with-negative").html(("مقدار خرید منفی : " + agent.amountWithNegative.toLocaleString()).replace("-", "") + " تومان");
        $("#negative-charge-ceiling").html(("مقدار شارژ منفی : " + agent.negativeChargeCeiling.toLocaleString()).replace("-", "") + " تومان");
    }

    $.getUserInformation = async () => {
        await api.getDigitallApi(`/User/GetUser/${id}`, false).then(async (data) => {
            api.hiddenModal();

            user = data;

            increase_user_balance_description.val('');
            increase_user_balance.val('');
            decrease_user_balance_description.val('');
            decrease_user_balance.val('');
            message_text.val('');
            description_text.val(data.description);

            $("#user-id").html("ایدی کاربر : " + data.id || "ثبت نشده");
            $("#email-id").html("ایمیل : " + (data.email ? data.email : "ثبت نشده"));
            $("#mobile").html("مبایل : " + (data.mobile ? data.mobile : "ثبت نشده"));
            $("#is-mobile-active").html("نمایش شماره : " + (data.isMobileActive ? "فعال " : "غیر فعال"));
            $("#telegram-user-name").html("ایدی تلگرام : " + (data.telegramUsername || "ثبت نشده"));
            $("#first-name").html("نام کاربر  : " + (data.firstName || "ثبت نشده"));
            $("#last-name").html("نام خانوادگی کاربر  : " + (data.lastName || "ثبت نشده"));
            $("#avatar").html("پروفایل : " + (data.avatar ? data.avatar : "ثبت نشده"));
            $("#address").html("آدرس : " + (data.address ? data.address : "ثبت نشده"));
            $("#agentId").html("ایدی عددی نماینده : " + (data.agentId || "ثبت نشده"));
            $("#create-date").html("زمان شروع کاربر : " + (api.gregorianToJalali(data.createDate ?? "-")));
            $("#modified-date").html("زمان ویرایش کاربر : " + (api.gregorianToJalali(data.modifiedDate ?? "-")));
            $("#chatId").html("ایدی عددی کاربر  : " + data.chatId || "ثبت نشده");
            $("#cardToCardPayment").html("نمایش شماره کارت  : " + (data.cardToCardPayment ? "فعال" : "غیر فعال"));
            $("#is-agent").html("عنوان : " + (data.isAgent ? "نماینده" : "کاربر عادی"));
            $("#balance-user").html("موجودی : " + (data.balance !== undefined ? data.balance.toLocaleString().replace(/^-/, "بدهکار ") + " تومان" : "ثبت نشده"));
            $("#is-blocked").html(data.isBlocked ? `<span class="badge bg-danger">غیر فعال</span>` : `<span class="badge bg-success">فعال</span>`);
            $("#user-description").html("توضیحات : " + (data.description ? data.description.trim() : "ثبت نشده"));

            data.isAgent ? await $.setAgencyInformation(data.agency) : "";

            btns.blocked.text = data.isBlocked ? "فعال کردن کاربر" : "غیر فعال کردن کاربر";
            btns.cardToCardPayment.text = data.cardToCardPayment ? "غیر فعال کردن کارت به کارت" : " فعال کردن کارت به کارت";
            btns.convertToAgent.isActive = !data.isAgent;
            btns.specialPercent.isActive = data.isAgent;
            btns.agencyInformation.isActive = data.isAgent;
            btns.transaction.btnEvent = () => window.location.href = `./transaction.html?id=${data.id}`;
            btns.roles.btnEvent = () => window.location.href = `./roles.html?id=${data.id}`;
            btns.permissions.btnEvent = () => window.location.href = `./permissions.html?id=${data.id}`;

            const btns_container = $("#user-action-btns-container");

            btns_container.html('');

            let description_btn = generateButton(btns.description);
            let sendMessage_btn = generateButton(btns.sendMessage);

            btns_container.append(description_btn);
            btns_container.append(sendMessage_btn);


            const buttons = [
                {key: "blocked_btn", value: btns.blocked},
                {key: "increaseBalance_btn", value: btns.increaseBalance},
                {key: "decreaseBalance_btn", value: btns.decreaseBalance},
                {key: "agencyInformation_btn", value: btns.agencyInformation},
                {key: "cardToCardPayment_btn", value: btns.cardToCardPayment},
                {key: "convertToAgent_btn", value: btns.convertToAgent},
                {key: "specialPercent_btn", value: btns.specialPercent},
                {key: "transaction_btn", value: btns.transaction},
                {key: "roles_btn", value: btns.roles},
                {key: "permissions_btn", value: btns.permissions},
            ]


            for (const btn of buttons) {
                if (await component_access(btn.key)) {
                    btns_container.append(generateButton(btn.value));
                }
            }

        });
    }


    await $.getUserInformation();

    await api.hiddenLoading();

    await $("#increase-balance-form").validate({
        rules: {
            increase_user_balance: {
                required: true,
                number: true
            },
        },
        messages: {
            increase_user_balance: {
                required: "مبلغ افزایش نمیتواند خالی باشد .",
                number: "افزایش موجودی باید عدد باشد ."
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let description = increase_user_balance_description.val().trim();
            let price = increase_user_balance.val();

            var obj = {description, price: +price, transactionType: 0};

            await api.postDigitallApi(`/Transaction/IncreaseBalance/${id}`, obj);

            await $.getUserInformation();
            await api.hiddenLoading();
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

    await $("#send-message-for-user").validate({
        rules: {
            message_text: {
                required: true,
                maxlength: 2000
            },
        },
        messages: {
            message_text: {
                required: "نمیتواند خالی باشد",
                maxlength: "پیام ارسالی نمیتواند بیشتر از 2000 کاراکتر باشد"
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let text = `✉️ کاربر عزیز یک پیام از سمت نماینده برای شما ارسال گردید
                       زمان ارسال:${new Date().toLocaleString("fa-IR")}
                       متن پیغام : ${message_text.val()}`;

            let obj = {
                message: text,
                notificationType: 0,
                forAllMember: false,
                userId: user.id,
                buttons: [],
                forward: false,
            }

            await api.postDigitallApi(`/Notification/AddNotification`, obj);

            await $.getUserInformation();
            await api.hiddenLoading();
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
    })

    await $("#decrease-balance-form").validate({
        rules: {
            decrease_user_balance: {
                required: true,
                number: true
            },
        },
        messages: {
            decrease_user_balance: {
                required: "مبلغ کاهش نمیتواند خالی باشد .",
                number: "کاهش موجودی باید عدد باشد ."
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let description = decrease_user_balance_description.val().trim();
            let price = decrease_user_balance.val();

            var obj = {description, price: +price, transactionType: 0};

            await api.postDigitallApi(`/Transaction/DecreaseBalance/${id}`, obj);

            await $.getUserInformation();
            await api.hiddenLoading();
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

    await $("#description-for-user").validate({
        rules: {
            description_text: {
                maxlength: 3000
            },
        },
        messages: {
            description_text: {
                maxlength: "نمیتواند بیشتر از 3000 کاراکتر باشد"
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let data = {
                id: user.id,
                isBlocked: user.isBlocked,
                cardToCardPayment: user.cardToCardPayment,
                description: description_text.val(),
            }

            await api.updateDigitallApi(`/User/UpdateUser`, data)

            special_percent.val("");
            special_percent.removeClass("is-invalid").removeClass("is-valid");


            await $.getUserInformation();
            await api.hiddenLoading();
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

    await $("#percent-age-form").validate({
        rules: {
            specialPercent: {
                required: true,
                number: true,
                range: [0, 75],
            },
        },
        messages: {
            specialPercent: {
                required: "درصد نمایندگی نمیتواند خالی باشد",
                range: "درصد نمایندگی باید بین 0 و 75 باشد",
                number: "باید حتما عدد باشد"
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let data = {
                id: user.id,
                isBlocked: user.isBlocked,
                cardToCardPayment: user.cardToCardPayment,
                specialPercent: special_percent.val(),
                description: description_text.val(),
            }

            await api.updateDigitallApi(`/User/UpdateUser`, data)

            special_percent.val("");
            special_percent.removeClass("is-invalid").removeClass("is-valid");

            await $.getUserInformation();
            await api.hiddenLoading();
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
    })
});
