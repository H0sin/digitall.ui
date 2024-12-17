import * as api from "./main.js";
import {updateDigitallApi} from "./main.js";

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
            isActive: true
        }
    }

    //----------------------------------- user update -------------------------------------------

    $.representTheUser = async () => {
        await api.showLoading();

        let data = {
            agentAdminId: user.id
        }

        let {statusCode, isSuccess, message} = await api.postDigitallApi("/Agent/AddAgent", data);

        if (statusCode == 0 && isSuccess == true) {
            api.notificationMessage(api.successTitle, message, api.successTheme)
        } else {
            api.notificationMessage(api.errorTitle, message, api.errorTheme)
        }

        await $.getUserInformation();

        await api.hiddenLoading();
    }

    $.changeCardToCardPaymentStatus = async () => {
        await api.showLoading();

        let data = {
            id: user.id,
            isBlocked: user.isBlocked,
            cardToCardPayment: !user.cardToCardPayment
        }

        let {statusCode, isSuccess, message} = await api.updateDigitallApi("/User/UpdateUser", data);

        if (statusCode == 0 && isSuccess == true) {
            api.notificationMessage(api.successTitle, message, api.successTheme)
        } else {
            api.notificationMessage(api.errorTitle, message, api.errorTheme)
        }

        await $.getUserInformation();

        await api.hiddenLoading();
    }

    $.changeBlockStatus = async () => {
        await api.showLoading();

        let data = {
            id: user.id,
            isBlocked: !user.isBlocked,
            cardToCardPayment: user.cardToCardPayment
        };

        let {statusCode, isSuccess, message} = await api.updateDigitallApi("/User/UpdateUser", data);

        if (statusCode == 0 && isSuccess == true) {
            api.notificationMessage(api.successTitle, message, api.successTheme)
        } else {
            api.notificationMessage(api.errorTitle, message, api.errorTheme)
        }

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
        await api.getDigitallApi(`/User/GetUser/${id}`).then(async ({data, statusCode, isSuccess, message}) => {
            api.hiddenModal();

            user = data;

            increase_user_balance_description.val('');
            increase_user_balance.val('');
            decrease_user_balance_description.val('');
            decrease_user_balance.val('');
            message_text.val('');


            if (statusCode != 0 || isSuccess != true) {
                await api.hiddenLoading();
                api.notificationMessage(api.errorTitle, "کاربر وجود نداشت", api.errorTheme)
            }

            $("#user-id").html("ایدی کاربر : " + data.id || "ثبت نشده");
            $("#email-id").html("ایمیل : " + (data.email ? "null" : "ثبت نشده"));
            $("#mobile").html("مبایل : " + (data.mobile ? "null" : "ثبت نشده"));
            $("#is-mobile-active").html("نمایش شماره : " + (data.isMobileActive ? "فعال " : "غیر فعال"));
            $("#telegram-user-name").html("ایدی تلگرام : " + (data.telegramUsername || "ثبت نشده"));
            $("#first-name").html("نام کاربر  : " + (data.firstName || "ثبت نشده"));
            $("#last-name").html("نام خانوادگی کاربر  : " + (data.lastName || "ثبت نشده"));
            $("#avatar").html("پروفایل  : " + (data.avatar ? "null" : "ثبت نشده"));
            $("#address").html("ادرس  : " + (data.address ? "null" : "ثبت نشده"));
            $("#agentId").html("ایدی عددی نماینده : " + (data.agentId || "ثبت نشده"));
            $("#create-date").html("زمان شروع کاربر : " + (api.gregorianToJalali(data.createDate ?? "-")));
            $("#modified-date").html("زمان ویرایش کاربر : " + (api.gregorianToJalali(data.modifiedDate ?? "-")));
            $("#chatId").html("ایدی عددی کاربر  : " + data.chatId || "ثبت نشده");
            $("#cardToCardPayment").html("نمایش شماره کارت  : " + (data.cardToCardPayment ? "فعال" : "غیر فعال"));
            $("#is-agent").html("عنوان : " + (data.isAgent ? "نماینده" : "کاربر عادی"));
            $("#balance-user").html("موجودی   : " + (data.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "بدهکار "));
            $("#is-blocked").html(data.isBlocked ? `<span class="badge bg-danger">غیر فعال</span>` : `<span class="badge bg-success">فعال</span>`);


            data.isAgent ? await $.setAgencyInformation(data.agency) : "";

            btns.blocked.text = data.isBlocked ? "فعال کردن کاربر" : "غیر فعال کردن کاربر";
            btns.cardToCardPayment.text = data.cardToCardPayment ? "غیر فعال کردن کارت به کارت" : " فعال کردن کارت به کارت";
            btns.convertToAgent.isActive = !data.isAgent;
            btns.specialPercent.isActive = data.isAgent;
            btns.agencyInformation.isActive = data.isAgent;

            const btns_container = $("#user-action-btns-container");

            btns_container.html('');

            let increase_btn = generateButton(btns.increaseBalance);
            let decrease_btn = generateButton(btns.decreaseBalance);
            let sendMessage_btn = generateButton(btns.sendMessage);
            let blocked_btn = generateButton(btns.blocked);
            let cardToCardPayment_btn = generateButton(btns.cardToCardPayment);
            let convertToAgent_btn = generateButton(btns.convertToAgent);
            let specialPercent_btn = generateButton(btns.specialPercent);
            let agencyInformation_btn = generateButton(btns.agencyInformation);
            let transaction_btn = generateButton(btns.transaction);

            btns_container.append(increase_btn);
            btns_container.append(decrease_btn);
            btns_container.append(agencyInformation_btn);
            btns_container.append(sendMessage_btn);
            btns_container.append(blocked_btn);
            btns_container.append(cardToCardPayment_btn);
            btns_container.append(convertToAgent_btn);
            btns_container.append(specialPercent_btn);
            btns_container.append(transaction_btn);
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

            let {statusCode, isSuccess, message} = await api.postDigitallApi(`/Transaction/IncreaseBalance/${id}`, obj);

            if (statusCode == 0 && isSuccess == true) {
                api.notificationMessage(api.successTitle, message, api.successTheme)
            } else {
                api.notificationMessage(api.errorTitle, message, api.errorTheme)
            }

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

            let {statusCode, isSuccess, message} = await api.postDigitallApi(`/Notification/AddNotification`, obj);

            if (statusCode == 0 && isSuccess == true) {
                api.notificationMessage(api.successTitle, message, api.successTheme)
            } else {
                api.notificationMessage(api.errorTitle, message, api.errorTheme)
            }

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

            let {statusCode, isSuccess, message} = await api.postDigitallApi(`/Transaction/DecreaseBalance/${id}`, obj);

            if (statusCode == 0 && isSuccess == true) {
                api.notificationMessage(api.successTitle, message, api.successTheme)
            } else {
                api.notificationMessage(api.errorTitle, message, api.errorTheme)
            }

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
                number : "باید حتما عدد باشد"
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();

            await api.showLoading();

            let data = {
                id: user.id,
                isBlocked: user.isBlocked,
                cardToCardPayment: user.cardToCardPayment,
                specialPercent: special_percent.val()
            }

            let {statusCode, isSuccess, message} = await api.updateDigitallApi(`/User/UpdateUser`, data);

            if (statusCode == 0 && isSuccess == true) {
                special_percent.val("");
                special_percent.removeClass("is-invalid").removeClass("is-valid");
                api.notificationMessage(api.successTitle, message, api.successTheme)
            } else {
                api.notificationMessage(api.errorTitle, message, api.errorTheme)
            }

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
});

