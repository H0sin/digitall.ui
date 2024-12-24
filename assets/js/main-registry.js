// import * as main from "./main.js";

// import {baseApiRequest} from "./main";


export const baseUrl = "http://188.245.230.0:8080"
export const baseApiRequest = `${baseUrl}/api`;

export const postRegistryApi = async (url, credentials) => {
    let response;

    await $.ajax({
        type: "POST",
        url:  baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("token"),
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

export const getRegistryApi = async (url) => {
    let response;
    try {
        await $.ajax({
            type: "GET",
            url:  baseApiRequest + url,
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
        return response;
    }

    return response;
};

export const updateRegistryApi = async (url, credentials, id = 0) => {
    let response;
    await $.ajax({
        type: "PUT",
        url:  baseApiRequest + url,
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