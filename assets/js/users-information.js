import * as api from "./main.js";

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
            dataBsTarget: "#IncreaseModal"
        },
        decreaseBalance: {
            text: "کاهش موجودی",
            dataBsTarget: "#decreaseModal"
        },
        sendMessage: {
            text: "ارسال پیام به کابر",
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
            text: "گذاشتن درصد ویژه برای کاربر",
            classes: "col-12",
            dataBsTarget: "#percentageModal"
        }
    }

    //----------------------------------- user update -------------------------------------------

    $.representTheUser = async () => {
        await api.showLoading();

        let data = {
            agentAdminId: user.id
        }

        let { statusCode, isSuccess, message } = await api.postDigitallApi("/Agent/AddAgent", data);

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

        let { statusCode, isSuccess, message } = await api.updateDigitallApi("/User/UpdateUser", data);

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

        let { statusCode, isSuccess, message } = await api.updateDigitallApi("/User/UpdateUser", data);

        if (statusCode == 0 && isSuccess == true) {
            api.notificationMessage(api.successTitle, message, api.successTheme)
        } else {
            api.notificationMessage(api.errorTitle, message, api.errorTheme)
        }

        await $.getUserInformation();

        await api.hiddenLoading();
    }


    $.getUserInformation = async () => {
        await api.getDigitallApi(`/User/GetUser/${id}`).then(async ({ data, statusCode, isSuccess, message }) => {
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

            $(`#user_information > div.card-body #user-id`).html(
                "ایدی کاربر : " + data.id || "ثبت نشده"
            );
            $(`#user_information > div.card-body #email-id`).html(
                "ایمیل : " + (data.email ? "null" : "ثبت نشده")
            );
            $(`#user_information > div.card-body #mobile`).html(
                "مبایل : " + (data.mobile ? "null" : "ثبت نشده")
            );
            $(`#user_information > div.card-body #is-mobile-active`).html(
                " نمایش شماره : " + (data.isMobileActive ? "فعال " : "غیر فعال")
            );
            $(`#user_information > div.card-body #telegram-user-name`).html(
                " ایدی تلگرام : " + (data.telegramUsername || "ثبت نشده")
            );
            $(`#user_information > div.card-body #first-name`).html(
                " نام کاربر  : " + (data.firstName || "ثبت نشده")
            );
            $(`#user_information > div.card-body #last-name`).html(
                " نام خانوادگی کاربر  : " + (data.lastName || "ثبت نشده")
            );
            $(`#user_information > div.card-body #avatar`).html(
                " پروفایل  : " + (data.avatar ? "null" : "ثبت نشده")
            );
            $(`#user_information > div.card-body #address`).html(
                " ادرس  : " + (data.address ? "null" : "ثبت نشده")
            );
            $(`#user_information > div.card-body #agentId`).html(
                "  ایدی عددی نماینده : " + (data.agentId || "ثبت نشده")
            );
            $(`#user_information > div.card-body #create-date`).html(
                "   زمان شروع کاربر   : " + (api.gregorianToJalali(data.createDate ?? "-"))
            );
            $(`#user_information > div.card-body #modified-date`).html(
                "    زمان ویرایش کاربر  : " + (api.gregorianToJalali(data.modifiedDate ?? "-"))
            );
            $(`#user_information > div.card-body #chatId`).html(
                "  ایدی عددی کاربر  : " + data.chatId || "ثبت نشده"
            );
            $(`#user_information > div.card-body #cardToCardPayment`).html(
                "   نمایش شماره کارت  : " + (data.cardToCardPayment ? "فعال" : "غیر فعال")
            );
            $(`#user_information > div.card-body #is-agent`).html(
                "  عنوان : " + (data.isAgent ? "نماینده" : "کاربر عادی")
            );
            $(`#user_information > div.card-body #balance-user`).html(
                " موجودی   : " + (data.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "بدهکار ")
            );
            $(`#user_information > div.card-body #is-blocked`).html(
                data.isBlocked
                    ? `<span class="badge bg-danger">غیر فعال</span>`
                    : `<span class="badge bg-success">فعال</span>`);


            btns.blocked.text = data.isBlocked ? "فعال کردن کاربر" : "غیر فعال کردن کاربر";
            btns.cardToCardPayment.text = data.cardToCardPayment ? "غیر فعال کردن کارت به کارت" : " فعال کردن کارت به کارت";
            btns.convertToAgent.isActive = !data.isAgent;
            btns.specialPercent.isActive = data.isAgent;

            const btns_container = $("#user-action-btns-container");

            btns_container.html('');

            let increase_btn = generateButton(btns.increaseBalance);
            let decrease_btn = generateButton(btns.decreaseBalance);
            let sendMessage_btn = generateButton(btns.sendMessage);
            let blocked_btn = generateButton(btns.blocked);
            let cardToCardPayment_btn = generateButton(btns.cardToCardPayment);
            let convertToAgent_btn = generateButton(btns.convertToAgent);
            let specialPercent_btn = generateButton(btns.specialPercent);

            btns_container.append(increase_btn);
            btns_container.append(decrease_btn);
            btns_container.append(sendMessage_btn);
            btns_container.append(blocked_btn);
            btns_container.append(cardToCardPayment_btn);
            btns_container.append(convertToAgent_btn);
            btns_container.append(specialPercent_btn);
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

            var obj = { description, price: +price, transactionType: 0 };

            let { statusCode, isSuccess, message } = await api.postDigitallApi(`/Transaction/IncreaseBalance/${id}`, obj);

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

            let { statusCode, isSuccess, message } = await api.postDigitallApi(`/Notification/AddNotification`, obj);

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
    })

    // notification-----and--------validation-----decrease-------
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

            var obj = { description, price: +price, transactionType: 0 };

            let { statusCode, isSuccess, message } = await api.postDigitallApi(`/Transaction/DecreaseBalance/${id}`, obj);

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
