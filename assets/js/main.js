// ''

// export const baseUrl = "https://test.samanii.com";
export const baseUrl = "http://localhost:5176";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;

// path variable -----------------------------------------------------------------------------------------------

export const transactionImagePath = (name) => `${baseUrl}/images/TransactionAvatar/origin/${name}`;

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


export const hiddenModal = () => {
    let show = $(".show");
    show.removeClass("show");
    show.css("display", "none");
    $(".modal-backdrop ").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
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
                debugger;
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

function fullName(data) {
    return data.firstName ? ((data.firstName || "") + " " + (data.lastName || "")) : data.telegramUsername;
}

$(document).ready(async function () {
    let bot_name = $("#bot_name");

    let {statusCode, isSuccess, message, data} = await getDigitallApi("/User/GetInformation");

    $("#fullName").html(" نام کاربری :" + " " + fullName(data));
    $("#balance").html("موجودی : " + (data.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "منفی "))
    // $("#transactionIndex").append("<a href='/transaction.html' class='btn-info'> </a>")
    bot_name.html(data.botName.replace("bot", "<span class='px-1'> Bot</span>"));

    bot_name.attr("href", data.botLink);

});