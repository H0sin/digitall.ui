import * as main from "./main.js";

export const baseUrl = "https://dev.samanii.com/api";

//-------------------------------------------  S I G N A L R  -----------------------------------------

$(document).ready(async function () {
    const hubUrl = "https://dev.samanii.com/supporterOnlineHub";

    $.getScript( "https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.0/signalr.min.js", function( data, textStatus, jqxhr ) {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => localStorage.getItem("registry-token")
            })
            .build();

        connection.on("UpdateSupporterOnline", (supporters) => {
            console.log("Online supporters updated:", supporters);
            if(supporters.length > 0) {
                $("#image-${id}").removeAttr("disabled");
            }
        });

        connection.start()
            .then(async () => {
                console.log("signalR connected.");
                const supporters = await connection.invoke("GetOnlineSupporterAsync");
            })
            .catch(err => {
                console.error("Error in connecting SignalR:", err);
            });
    });
})


//-------------------------------------------- token --------------------------------------------
export const postRegistryUserApi = async () => {
    await main.getUserInformation();

    let user = main.user_information;

    let obj = {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.telegramUsername,
        chatId: user.chatId,
    }

    await $.ajax({
        type: "POST",
        url: baseUrl + "/User",
        data: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
        success: async function ({data}) {
            localStorage.setItem("registry-token", data);
        },
        error: async function (ex) {
            main.notificationMessage("خطا", "خطا در ارتباط با سرور", main.warningTheme);
        },
    });
};
//-------------------------------------------------------------------------------------------------------
//------------------------------------------ post -------------------------------------------------------
export const postRegistryApi = async (path, credentials, fire = true, authType = 'Bearer ') => {
    let response;

    await $.ajax({
        type: "POST",
        url: baseUrl + path,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: authType + localStorage.getItem("registry-token"),
            "Content-Type": "application/json",
        },
        success: async function ({data, isSuccess, message, statusCode}) {
            if (fire) main.autoNotification(statusCode, isSuccess, message);
            response = data;
        },
        error: async function (ex) {
            main.notificationMessage("خطا", "خطا در ارتباط با سرور", main.warningTheme);
        },
    });

    return response;
};
//------------------------------------------------------------------------------------------
//--------------------------------------------- get ----------------------------------------
export const getRegistryApi = async (path, fire = true, authType = 'Bearer ') => {
    let response;
    try {
        await $.ajax({
            type: "GET",
            url: baseUrl + path,
            headers: {
                Authorization: authType + localStorage.getItem("registry-token"),
                "Content-Type": "application/json",
            },
            success: async function ({data, isSuccess, message, statusCode}) {
                if (fire) main.autoNotification(statusCode, isSuccess, message);
                response = data;
            },
            error: async function (jqXHR) {
                response = {
                    statusCode: jqXHR.status,
                    error: jqXHR.responseText || jqXHR.status

                }
            },
        });
    } catch (ex) {
        return response;
    }

    return response;
};
//-------------------------------------------------------------------------------------------
//---------------------------------------- update -------------------------------------------
export const updateRegistryApi = async (path, credentials, id = 0, fire = true, authType = 'Bearer ') => {
    let response;
    await $.ajax({
        type: "PUT",
        url: baseUrl + path,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("registry-token"),
            "Content-Type": "application/json",
        },
        success: async function ({data, isSuccess, message, statusCode}) {
            if (fire) main.autoNotification(statusCode, isSuccess, message);
            response = data;
        },
        error: async function (ex) {
            main.notificationMessage("خطا", "خطا در ارتباط با سرور", warningTheme);
        },
    });

    return response;
}
//-------------------------------------------------------------------------------------------



