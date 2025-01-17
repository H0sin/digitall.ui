// ''

export const baseUrl = "https://test.samanii.com";
// export const baseUrl = "http://localhost:5176";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;
export let user_information = {};

// Cookie Option -----------------------------------------------------------------------------------------------

export function setCookie(name,value,minuts) {
    let expires = "";
    if (minuts) {
        let date = new Date();
        date.setTime(date.getTime() + (minuts*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// path variable -----------------------------------------------------------------------------------------------

export const transactionImagePath = (name) => `${baseUrl}/images/TransactionAvatar/origin/${name}`;

export let colors = {
    primary: "#6571ff",
    secondary: "#7987a1",
    success: "#05a34a",
    info: "#66d1d1",
    warning: "#fbbc06",
    danger: "#ff3366",
    light: "#e9ecef",
    dark: "#060c17",
    muted: "#7987a1",
    gridBorder: "rgba(77, 138, 240, .15)",
    bodyColor: "#b8c3d9",
    cardBg: "#0c1427"
}


export let fontFamily = "'iransans', Helvetica, sans-serif";

// start variable meessage information -------------------------------------------------------------------------

export const successTitle = "پیغام موفقیت";
export const successTheme = "success";
export const errorTitle = "پیغام خطا";
export const errorTheme = "error";
export const infoTitle = "پیغام اطلاع";
export const infoTheme = "info";
export const warningTitle = "پیغام هشدار";
export const warningTheme = "warning";

export function notificationMessage(title, text, theme, showDuration = 4000, closeOnClick = true) {
    window.createNotification({
        closeOnClick,
        displayCloseButton: false,
        positionClass: "nfc-bottom-right",
        showDuration,
        theme: theme !== "" ? theme : "success",
    })({
        title: title !== "" ? title : "اعلان",
        message: decodeURI(text),
    });
}

export function hideNotificationMessage() {
    $('.ncf').fadeOut(300, function () {
        $(this).remove();
    });
}

export function autoNotification(statusCode, isSuccess, message) {
    if (statusCode == 0 && isSuccess) {
        notificationMessage(successTitle, message, successTheme);
    } else {
        notificationMessage(errorTitle, message, errorTheme);
    }
}

// ------------------------------------------------------ U T I L I T I E S -------------------------------------------------------

export function fullName(data) {
    if (data) return data.firstName ? ((data.firstName || "") + " " + (data.lastName || "")) : data.telegramUsername;
    return "";
}

export const hiddenModal = () => {
    let show = $(".show");
    show.removeClass("show");
    show.css("display", "none");
    $(".modal-backdrop ").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
}

export function generateModal(name, title = "", body = "") {
    let modal = $(`<div class="modal fade show" id="${name}-modal" tabindex="-1" aria-labelledby="varyingModalLabel"
             aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="btn-close"></button>
                    </div>
                    <div class="modal-body">
                       ${body}
                    </div>
                </div>
            </div>
        </div>`);

    $(".main-wrapper").append(modal);

    $("[aria-label='btn-close']").on("click", function () {
        destroidModal(name);
    });

    $(modal).show();
}

export function destroidModal(name) {
    $(`#${name}-modal`).remove();
}

// ------------------------------------------------------- L O D I N G -------------------------------------------------------------

export const loadingContainer = $("#loading-container");
export const loading = $();

export async function showLoading() {
    await $(loadingContainer).toggleClass("d-none");
}

export async function hiddenLoading() {
    await $(loadingContainer).toggleClass("d-none");
}

// start convert date ---------------------------------------------------------------------------------------

export function gregorianToJalali(dateString) {
    const gDate = new Date(dateString);
    gDate.setHours(0, 0, 0, 0);
    const offset = 226899;
    const jDate = new Date(gDate.getTime() - offset * 24 * 60 * 60 * 1000);

    return `${jDate.getFullYear()}/${(jDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${jDate.getDate().toString().padStart(2, "0")}`;
}


// end convert date ---------------------------------------------------------------------------------------

// start login api -------------------------------------------------------------------------------------------
export const DigitallLogin = async (action, credentials) => {
    try {
        const response = await fetch(baseUrl + action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data, isSuccess } = await response.json();

        if (isSuccess) {
            if (data) {
                localStorage.setItem("token", data.data);
                await notificationMessage(successTitle, "خوش آمدید", successTheme);
                console.log("Token stored in localStorage:", data.data);
            } else {
                console.warn("No token received.");
            }
        } else {
            notificationMessage(
                errorTitle,
                "کلمه عبور یا نام کاربری اشتباه است",
                errorTheme
            );
        }
        return data;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};

// end login api -------------------------------------------------------------------------------------------

// start post token from header ---------------------------------------------------------------------------

export const postDigitallApi = async (url, credentials, fire = true, authType = 'bearer ') => {
    let response;

    await $.ajax({
        type: "POST",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: authType + getCookie("token"),
            "Content-Type": "application/json",
        },
        success: async function ({ data, isSuccess, message, statusCode }) {
            if (fire) autoNotification(statusCode, isSuccess, message);
            response = data;
        },
        error: async function (ex) {
            notificationMessage("خطا", "خطا در ارتباط با سرور", warningTheme);
        },
    });

    return response;
};

// end post token from header ---------------------------------------------------------------------------

// start get token from header ---------------------------------------------------------------------------

export const getDigitallApi = async (url, fire = true, authType = 'bearer ') => {
    let response;
    try {
        await $.ajax({
            type: "GET",
            url: baseApiRequest + url,
            headers: {
                Authorization: authType + getCookie("token"),
                "Content-Type": "application/json",
            },
            success: async function ({ data, isSuccess, message, statusCode }) {
                if (fire) autoNotification(statusCode, isSuccess, message);
                response = data;
            },
            error: async function (ex) {
                notificationMessage("خطا", "خطا در ارتباط با سرور", warningTheme);
            },
        });
    } catch (ex) {
        // In case of unexpected errors
        return response;
    }

    return response;
};

// end get token from header -----------------------------------------------------------------------------


// update method  token from header  -----------------------------------------------------------------------------

export const updateDigitallApi = async (url, credentials, id = 0, fire = true, authType = 'bearer ') => {
    let response;
    await $.ajax({
        type: "PUT",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: authType + getCookie("token"),
            "Content-Type": "application/json",
        },
        success: async function ({ data, isSuccess, message, statusCode }) {
            if (fire) autoNotification(statusCode, isSuccess, message);
            response = data;
        },
        error: async function (ex) {
            notificationMessage("خطا", "خطا در ارتباط با سرور", warningTheme);
        },
    });

    return response;
}


// --------------------------------------------------------------------------------------------------------


// start information --------------------------------------------------------------------------------------

const icons = {
    buy: "shopping-cart",
    rebuy: "refresh-cw",
};

//-------------------------------N O T I F I C A T I O N T Y P E ----------------------------------------

const fixedGenerateNotificationItem = (notificationType) => {
    switch (notificationType) {
        case 0:
            return `<p class="tx-12 text-muted mb-0">پیام جدید</p>`;
        case 1:
            return `<p class="tx-12 text-muted mb-0">هشدار جدید</p>`;
        case 2:
            return `<p class="tx-12 text-muted mb-0">خطا جدید</p>`;
        case 3:
            return `<p class="tx-12 text-muted mb-0">موفقیت جدید</p>`;
        case 4:
            return `<p class="tx-12 text-muted mb-0">اغاز جدید</p>`;
        case 5:
            return `<p class="tx-12 text-muted mb-0">پرداخت جدید</p>`;
        case 6:
            return `<p class="tx-12 text-muted mb-0">باگ جدید</p>`;
        case 7:
            return `<p class="tx-12 text-muted mb-0">خرید جدید</p>`;
        case 8:
            return `<p class="tx-12 text-muted mb-0">تمدید جدید</p>`;
        case 9:
            return `<p class="tx-12 text-muted mb-0">FinancialReports</p>`;
        case 10:
            return `<p class="tx-12 text-muted mb-0">DeletedReports</p>`;
        case 11:
            return `<p class="tx-12 text-muted mb-0">درخواست نماینده جدید</p>`;
    }
}

export const fixedFeatherIcon = (notificationType) => {
    switch (notificationType) {
        case 0:
            return `<i data-feather="mail" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 1:
            return `<i data-feather="alert-triangle" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 2:
            return `<i data-feather="x" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 3:
            return `<i data-feather="check" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 4:
            return `<i data-feather="power" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 5:
            return `<i data-feather="gift" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 6:
            return `<i data-feather="cloud-off" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 7:
            return `<i data-feather="shopping-cart" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 8:
            return `<i data-feather="rotate-cw" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 9:
            return `<i data-feather="" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 10:
            return `<i data-feather="" class="text-primary" style="width: 20px; height: 20px;"></i>`;
        case 11:
            return `<i data-feather="user-plus" class="text-primary" style="width: 20px; height: 20px;"></i>`;
    }
}

//------------------------------------------------------------------------------------------------------

async function generateNotificationItem(data) {
    return `
				<li>
                <a href="#" class="dropdown-item d-flex align-items-center py-2">
                    <div class="d-flex align-items-center justify-content-center me-3">
                        ${fixedFeatherIcon(data.notificationType)}
                    </div>
                    <div class="flex-grow-1 me-2 text-truncate">
                        <p class="mb-0">${fixedGenerateNotificationItem(data.notificationType)}</p>
                        <p class="tx-12 text-muted mb-0">${data.message}</p>
                    </div>
                </a>
            </li>
`;

}

async function loadNotificaciones() {
    const notification_container = $("#notification-container");

    let data = await getDigitallApi("/Notification/GetNotifications", false);

    const notificationCount = Math.min(6, data.length);

    const notifications = $(`
        <div class="dropdown-menu p-2" id="notifications" aria-labelledby="notificationDropdown">
            <div class="px-3 py-2 d-flex align-items-center justify-content-between border-bottom">
                <p>${notificationCount} تراکنش جدید</p>
            </div>
        </div>
    `);

    if (data.length > 0) {
        for (let i = 0; i < notificationCount; i++) {
            notifications.append(await generateNotificationItem(data[i]));
        }
    }

    notifications.append(`<div class="px-3 py-2 d-flex align-items-center justify-content-center border-top"><a href="/digitall.ui/notification.html">مشاهده همه</a></div>`);

    notification_container.append(notifications);

}


export const getUserInformation = new Promise(async resolve => {

    user_information = await getDigitallApi("/User/GetInformation", false);
    $("#fullName").html(" نام کاربری :" + " " + fullName(user_information));
    $("#balance").html("موجودی : " + (user_information.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "منفی "));
    $("#profile").html();
    $("#bot_name").html(user_information.botName.replace("bot", "<span class='px-1'> Bot</span>"));
    $("#bot_name").attr("href", user_information.botLink);
    // feather.replace();

    resolve();
});

export const getAgentUserInformation = new Promise(async resolve => {
    const user_agent_information = await getDigitallApi("/Agent/GetUserAgent", false);
    resolve(user_agent_information);
});

$(document).ready(async function () {
    await getUserInformation;
    await loadNotificaciones();
});

