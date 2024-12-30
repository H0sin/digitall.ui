"use strict";

/*
 * main-registry.js
 *
 * This file demonstrates:
 * 1) Setting up SignalR connections (PaymentHub and SupporterOnlineHub) using ES6.
 * 2) Providing sample AJAX functions (POST, GET, PUT).
 * 3) Handling user token storage and retrieval.
 * 4) Example event registrations for real-time notifications.
 */

// --------------------------------------- CONSTANTS & GLOBALS ---------------------------------------

import * as main from "./main.js";

export const BASE_URL = "https://dev.samanii.com/";
export const BASE_API_URL = `${BASE_URL}api`;

export const HUB_SUPPORTER_ONLINE_URL = `${BASE_URL}supporterOnlineHub`;
export const HUB_PAYMENT_URL = `${BASE_URL}paymentHub`;

/**
 * This will hold user information or you can import from another file if needed.
 * For demonstration, it's just a placeholder.
 */
let userInformation = null;

// SignalR connections
export let paymentConnection = null;
let supporterOnlineConnection = null;

// --------------------------------------- SIGNALR CONFIG ---------------------------------------

/**
 * Initializes and starts SignalR connections for both PaymentHub and SupporterOnlineHub.
 * It loads the SignalR script dynamically if not already loaded.
 */
export const startAllSignalRConnections = async () => {
    // Load SignalR library from a CDN or a local path (if not already included in your HTML)
    await $.getScript("../assets/vendors/signalr/signalr.min.js");

    // Create the PaymentHub connection
    paymentConnection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_PAYMENT_URL, {
            accessTokenFactory: () => localStorage.getItem("registry-token"),
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    // Create the SupporterOnlineHub connection
    supporterOnlineConnection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_SUPPORTER_ONLINE_URL, {
            accessTokenFactory: () => localStorage.getItem("registry-token"),
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    // Register event handlers for PaymentHub
// /*    paymentConnection.on("PaymentRegistered", (payment) => {
//         console.log("PaymentRegistered:", payment);
//         // You can update your UI here, e.g. add a new item to a list
//     });*/

    // paymentConnection.on("PaymentUpdated", (payment) => {
    //     console.log("PaymentUpdated:", payment);
    //     // Update UI elements or notify the user
    // });
    //
    // paymentConnection.on("Error", (errorMessage) => {
    //     console.error("Error from PaymentHub:", errorMessage);
    //     alert(errorMessage);
    // });

    // Register event handlers for SupporterOnlineHub
    supporterOnlineConnection.on("UpdateSupporterOnline", (supporters) => {
        console.log("Online supporters updated:", supporters);
        if (supporters.length > 0) {
            $(".paymentPrice").removeAttr("disabled");
        } else {
            $(".paymentPrice").prop("disabled", true);
        }
    });

    // Start both connections
    try {
        await supporterOnlineConnection.start();
        console.log("Connected to SupporterOnlineHub.");
    } catch (err) {
        console.error("Failed to connect to SupporterOnlineHub:", err);
    }

    try {
        await paymentConnection.start();
        console.log("Connected to PaymentHub.");
    } catch (err) {
        console.error("Failed to connect to PaymentHub:", err);
    }
};

/**
 * Invokes the "RegisterPayment" method on the PaymentHub to register a new payment.
 * @param {object} paymentObject - The data you want to send (must match your server-side DTO).
 */
export const registerPayment = async (paymentObject) => {
    if (!paymentConnection) {
        console.warn("Payment connection is not initialized.");
        return;
    }
    try {
        await paymentConnection.invoke("RegisterPayment", paymentObject);
        console.log("RegisterPayment invoked successfully.");
    } catch (err) {
        console.error("Error invoking RegisterPayment:", err);
        alert("Payment registration failed. Please try again.");
    }
};

/**
 * Example method to retrieve the list of online supporters, if your hub provides such a method.
 */
export const getOnlineSupporters = async () => {
    if (!supporterOnlineConnection) {
        console.warn("SupporterOnline connection is not initialized.");
        return [];
    }
    try {
        const supporters = await supporterOnlineConnection.invoke("GetOnlineSupporterAsync");
        console.log("Online supporters:", supporters);
        return supporters;
    } catch (err) {
        console.error("Error invoking GetOnlineSupporterAsync:", err);
        return [];
    }
};

// --------------------------------------- AJAX UTILITIES ---------------------------------------

/**
 * Retrieves or updates user information, then requests a token from your API (POST /User).
 */
export const postRegistryUserApi = async () => {
    // Suppose userInformation is fetched from somewhere or filled manually
    // userInformation = { firstName: 'John', lastName: 'Doe', telegramUsername: 'john_doe', chatId: 12345 };

    const obj = {
        firstName: userInformation?.firstName || "",
        lastName: userInformation?.lastName || "",
        userName: userInformation?.telegramUsername || "",
        chatId: userInformation?.chatId || 0,
    };

    try {
        const response = await $.ajax({
            type: "POST",
            url: `${BASE_API_URL}/User`,
            data: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            },
        });
        // Assuming the response structure is { data: "tokenString", ... }
        localStorage.setItem("registry-token", response.data);
    } catch (err) {
        console.error("Error in postRegistryUserApi:", err);
        // If you have a notification system, call it here
    }
};

/**
 * Generic POST request to your API.
 * @param {string} path - The endpoint path after BASE_API_URL.
 * @param {object} credentials - The body data to send.
 * @param {boolean} fire - Whether to trigger a notification (optional).
 * @param {string} authType - Authorization header prefix (e.g., 'Bearer ').
 * @returns {any} response - The parsed response data.
 */
export const postRegistryApi = async (path, credentials, fire = true, authType = "Bearer ") => {
    let response;
    try {
        const result = await $.ajax({
            type: "POST",
            url: `${BASE_API_URL}/${path}`,
            data: JSON.stringify(credentials),
            headers: {
                Authorization: `${authType}${localStorage.getItem("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        const { data, isSuccess, message, statusCode } = result;

        // Optionally show notifications if "fire" is true
        if(fire) main.autoNotification(statusCode, isSuccess, message);
        response = data;
    } catch (ex) {
        console.error("Error in postRegistryApi:", ex);
        // Show error notification if needed
    }
    return response;
};

/**
 * Generic GET request to your API.
 * @param {string} path - The endpoint path after BASE_API_URL.
 * @param {boolean} fire - Whether to trigger a notification.
 * @param {string} authType - Authorization header prefix.
 * @returns {any} response - The parsed response data or an error object.
 */
export const getRegistryApi = async (path, fire = true, authType = "Bearer ") => {
    let response;
    try {
        const result = await $.ajax({
            type: "GET",
            url: `${BASE_API_URL}/${path}`,
            headers: {
                Authorization: `${authType}${localStorage.getItem("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        const { data, isSuccess, message, statusCode } = result;
        // Optionally show notifications if "fire" is true
        // e.g. autoNotification(statusCode, isSuccess, message);
        response = data;
    } catch (ex) {
        console.error("Error in getRegistryApi:", ex);
        response = {
            statusCode: ex?.status ?? 500,
            error: ex?.responseText || ex?.status,
        };
    }
    return response;
};

/**
 * Generic PUT request to your API.
 * @param {string} path - The endpoint path after BASE_API_URL.
 * @param {object} credentials - Body data to send.
 * @param {number} id - Optional ID if needed for route.
 * @param {boolean} fire - Whether to trigger a notification.
 * @param {string} authType - Authorization header prefix.
 * @returns {any} response - The parsed response data.
 */
export const updateRegistryApi = async (path, credentials, id = 0, fire = true, authType = "Bearer ") => {
    let response;
    try {
        const result = await $.ajax({
            type: "PUT",
            url: `${BASE_API_URL}/${path}`, // If you need /path/:id, you can embed the id here
            data: JSON.stringify(credentials),
            headers: {
                Authorization: `${authType}${localStorage.getItem("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        const { data, isSuccess, message, statusCode } = result;
        // Optionally show notifications if "fire" is true
        // e.g. autoNotification(statusCode, isSuccess, message);
        if(fire) main.autoNotification(statusCode, isSuccess, message);
        response = data;
    } catch (ex) {
        console.error("Error in updateRegistryApi:", ex);
        // Show error notification if needed
    }
    return response;
};

// --------------------------------------- DOCUMENT READY ---------------------------------------

/**
 * Example usage: On document ready, we can start all SignalR connections and do any initialization needed.
 */
$(document).ready(async () => {
    // Optionally show loading UI
    // showLoading();

    // Start all SignalR connections
    await startAllSignalRConnections();

    // For example, retrieve the current online supporters
    const supporters = await getOnlineSupporters();
    console.log("Initial online supporters:", supporters);

    // Optionally hide loading UI
    // hideLoading();
});
