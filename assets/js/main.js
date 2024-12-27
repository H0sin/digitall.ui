// ''

export const baseUrl = "https://test.samanii.com";
// export const baseUrl = "http://localhost:5176";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;
export let user_information = {};

// path variable -----------------------------------------------------------------------------------------------

export const transactionImagePath = (name) => `${baseUrl}/images/TransactionAvatar/origin/${name}`;

export let colors = {
    primary        : "#6571ff",
    secondary      : "#7987a1",
    success        : "#05a34a",
    info           : "#66d1d1",
    warning        : "#fbbc06",
    danger         : "#ff3366",
    light          : "#e9ecef",
    dark           : "#060c17",
    muted          : "#7987a1",
    gridBorder     : "rgba(77, 138, 240, .15)",
    bodyColor      : "#b8c3d9",
    cardBg         : "#0c1427"
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

export function notificationMessage(title, text, theme) {
    window.createNotification({
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: "nfc-bottom-right",
        showDuration: 4000,
        theme: theme !== "" ? theme : "success",
    })({
        title: title !== "" ? title : "اعلان",
        message: decodeURI(text),
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
    return data.firstName ? ((data.firstName || "") + " " + (data.lastName || "")) : data.telegramUsername;
}

export const hiddenModal = () => {
    let show = $(".show");
    show.removeClass("show");
    show.css("display", "none");
    $(".modal-backdrop ").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
}

export function generateModal(name, title = "" , body = "" ){
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

    $("[aria-label='btn-close']").on("click", function() {
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

        const {data, isSuccess} = await response.json();

        if (isSuccess) {
            if (data) {
                localStorage.setItem("token", "bearer " + data.data);
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

export const postDigitallApi = async (url, credentials) => {
    let response;

    await $.ajax({
        type: "POST",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: async function (data) {
            //check if (data.statusCode != 0 | data.isSuccess == false) {}
            //todo : notification error for mserver message = data.message
            response = data;
        },
        error: async function (ex) {
        },
    });

    return response;
};

// end post token from header ---------------------------------------------------------------------------

// start get token from header ---------------------------------------------------------------------------

export const getDigitallApi = async (url) => {
    let response;
    try {
        await $.ajax({
            type: "GET",
            url: baseApiRequest + url,
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            success: async function (result) {
                response = result;
            },
            error: async function (jqXHR) {
                response = {
                    statusCode: jqXHR.status,
                    error: jqXHR.responseText || jqXHR.statusText,
                };
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

export const updateDigitallApi = async (url, credentials, id = 0) => {
    let response;
    await $.ajax({
        type: "PUT",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: async function (result) {
            response = result;
        },
        error: async function (ex) {
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

async function generateNotificationItem(notification) {
    return `
				<div class="p-1 border-bottom">
					<a href="#" class="dropdown-item d-flex align-items-center py-2">
						<div class=" d-flex align-items-center justify-content-center me-3">
						<i data-feather="shopping-cart" class="text-white" style="width: 20px; height: 20px; " ></i>
						</div>
						<div class="flex-grow-1 me-2" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
							<p>خرید جدید</p>
							<p class="tx-12 text-muted">${notification.message}</p>
						</div>
					</a>
			    </div>`;

}

async function loadNotificaciones() {
    const notification_container = await $("#notification-container");

    const notifications = $(`<div class="dropdown-menu p-2" id="notifications" aria-labelledby="notificationDropdown"><div class="px-3 py-2 d-flex align-items-center justify-content-between border-bottom"><p>6 تراکنش جدید</p></div>`);

    let {data} = await getDigitallApi("/Notification/GetNotifications");

    if(data.length)
        for (let i = 0; i < 6; i++) {
            notifications.append(await generateNotificationItem(data[i]));
        }

    notifications.append(`<div class="px-3 py-2 d-flex align-items-center justify-content-center border-top"><a href="/project/transaction.html">مشاهده همه</a></div>`);

    notification_container.append(notifications);
}

export async function getUserInformation() {
    await getDigitallApi("/User/GetInformation").then(({data}) => {
        user_information = data;
    });

    $("#fullName").html(" نام کاربری :" + " " + fullName(user_information));
    $("#balance").html("موجودی : " + (user_information.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "منفی "));
    $("#bot_name").html(user_information.botName.replace("bot", "<span class='px-1'> Bot</span>"));
    $("#bot_name").attr("href", user_information.botLink);
    feather.replace();
}

$(document).ready(async function () {
    await getUserInformation();
    await loadNotificaciones();
});
