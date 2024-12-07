// ''


export const baseUrl = "https://test.samanii.com";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;

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

// end variable meessage information -------------------------------------------------------------------------

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

        const data = await response.json();

        if (data.isSuccess) {
            if (data.data) {
                localStorage.setItem("token", "bearer " + data.data);
                notificationMessage(successTitle, "خوش آمدید", successTheme);
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

// call with token ---------------------------------------------------------------

// post token from header ---------------------------------------------------------------
export const postDigitallApi = async (url, credentials) => {
    let response;

    await $.ajax({
        type: "POST",
        url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        success: async function (data) {
            //check if (data.statusCode != 0 | data.isSuccess == false) {}
            //todo : notification error for mserver message = data.message
            response = data;
        },
        erorr: async function (ex) { },
    });

    return response;
};

// get token from header ---------------------------------------------------------------
export const getDigitallApi = async (url) => {
    let response;
    await $.ajax({
        type: "GET",
        url: baseApiRequest + url,
        headers: {
            Authorization: localStorage.getItem('token'),
            "Content-Type": "application/json",
        },
        success: async function (result) {
            //check if (data.statusCode != 0 | data.isSuccess == false) {}
            //todo : notification error for mserver message = data.message
            response = result;
            // return response;
        },
        erorr: async function (ex) { },
    });

    return response;
};


$(document).ready(function () {
    let token = localStorage.getItem("token");
    if (!token) {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        localStorage.setItem("token", "bearer " + params.get('token'));
    }

    // set agent information
    getDigitallApi("/User/GetUser").then(({ data }) => {
        $("#fullName").html(
            (data.firstName || "") + " " + (data.lastName || "")
        );
    });
});
