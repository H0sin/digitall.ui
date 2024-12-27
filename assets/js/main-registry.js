import * as main from "./main.js";
//import {baseApiRequest} from "./main.js";

export const baseUrl = "http://188.245.230.0:8080/api";

//-------------------------------------------- token --------------------------------------------
await main.getUserInformation();

let user = main.user_information;

let obj = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.telegramUsername,
    chatId: user.chatId,
}

export const postRegistryUserApi = async () => {
    await $.ajax({
        type: "POST",
        url: baseUrl + "/User",
        data: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
        success: async function ({data,isSuccess}) {
            localStorage.setItem("registry-token", "bearer " + data);
            console.log("Registry Token: ", localStorage.getItem("registry-token"));
            console.log(localStorage.getItem("token"));
        },
        error: async function (ex) {
        },
    });
};
//--------------------------------------------------------------------------------------------
//------------------------------------------ post ---------------------------------------------
export const postRegistryApi = async (url, credentials) => {
    let response;

    await $.ajax({
        type: "POST",
        url:baseUrl + "/Registry",
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("registry-token"),
            "Content-Type": "application/json",
        },
        success: async function (data) {

            response = data;
        },
        error: async function (ex) {
        },
    });

    return response;
};
//------------------------------------------------------------------------------------------
//--------------------------------------------- get ----------------------------------------
export const getRegistryApi = async (url) => {
    let response;
    try {
        await $.ajax({
            type: "GET",
            url: baseUrl + "/Registry",
            headers: {
                Authorization: localStorage.getItem("registry-token"),
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
        return response;
    }

    return response;
};
//-------------------------------------------------------------------------------------------
//---------------------------------------- update -------------------------------------------
export const updateRegistryApi = async (url, credentials, id = 0) => {
    let response;
    await $.ajax({
        type: "PUT",
        url:  baseUrl + "/Registry",
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("registry-token"),
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
//-------------------------------------------------------------------------------------------





