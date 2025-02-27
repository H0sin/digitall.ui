"use strict";

import {
    autoNotification, getAgentUserInformation,
    getCookie,
    getUserInformation,
    setCookie,
    user_information
} from "./main.js";

// --------------------------------------- CONSTANTS & GLOBALS ---------------------------------------

// export const BASE_URL = "http://localhost:8080/";
export const BASE_URL = "https://dev.samanii.com/";
export const BASE_API_URL = `${BASE_URL}api`;
export const HUB_SUPPORTER_ONLINE_URL = `${BASE_URL}supporterOnlineHub`;
export const HUB_PAYMENT_URL = `${BASE_URL}paymentHub`;
export let supporter;
export let paymentConnection = null;
export let supporterOnlineConnection = null;
export let REGISTRY_USER = null;

let isConnecting = false;

// --------------------------------------- SIGNALR CONFIG ---------------------------------------

/**
 * Initializes and starts SignalR connections for PaymentHub and SupporterOnlineHub.
 */
export const startAllSignalRConnections = async () => {
    if (isConnecting) {
        console.log("Already attempting to connect.");
        return;
    }

    try {
        if (!window.signalR) {
            await $.getScript("../assets/vendors/signalR/signalr.min.js");
            console.log("SignalR library loaded.");
        }

// Initialize PaymentHub connection

        if (!paymentConnection || paymentConnection.state === signalR.HubConnectionState.Disconnected) {
            paymentConnection = new signalR.HubConnectionBuilder()
                .withUrl(HUB_PAYMENT_URL, {
                    accessTokenFactory: () => getCookie("registry-token"),
                })
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            paymentConnection.on("PaymentRegistered", (payment) => {
                console.log("PaymentRegistered:", payment);
            });

            paymentConnection.on("PaymentUpdated", (payment) => {
                console.log("PaymentUpdated:", payment);
            });

            paymentConnection.onclose((error) => {
                console.error(`PaymentHub connection closed: ${error}`);
            });

            try {
                await paymentConnection.start();
                console.log("Connected to PaymentHub.");
            } catch (err) {
                console.error("Failed to connect to PaymentHub:", err);
            }
        }

// Initialize SupporterOnlineHub connection

        if (!supporterOnlineConnection || supporterOnlineConnection.state === signalR.HubConnectionState.Disconnected) {
            supporterOnlineConnection = new signalR.HubConnectionBuilder()
                .withUrl(HUB_SUPPORTER_ONLINE_URL, {
                    accessTokenFactory: () => getCookie("registry-token"),
                })
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            supporterOnlineConnection.on("UpdateSupporterOnline", (supporters) => {
                console.log("Online supporters updated:", supporters);
                $(".paymentPrice").prop("disabled", supporters.length === 0);
            });

            supporterOnlineConnection.onclose((error) => {
                console.error(`SupporterOnlineHub connection closed: ${error}`);
            });

            try {
                await supporterOnlineConnection.start();
                console.log("Connected to SupporterOnlineHub.");
            } catch (err) {
                console.error("Failed to connect to SupporterOnlineHub:", err);
            }
        }
    } catch (err) {
        console.error("Error in starting SignalR connections:", err);
    } finally {
        // isConnecting = false;
        // supporterOnlineConnection = null;
        // paymentConnection = null;
    }
};

/**
 * Invokes the "RegisterPayment" method on the PaymentHub to register a new payment.
 * @param {object} paymentObject - The data you want to send.
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
 * Invokes the ConfirmPayment method on the PaymentHub.
 * @param {number} registryId - The unique ID of the registry to confirm.
 * @param {number} price - The confirmed price for the registry.
 * @param {string} paymentLink - The payment link associated with the registry.
 */
export const confirmPayment = async (registryId, price,profit, paymentLink) => {
    if (!paymentConnection) {
        console.warn("Payment connection is not initialized.");
        return;
    }
    try {
        await paymentConnection.invoke("ConfirmPayment", registryId,profit, price, paymentLink);
        console.log("ConfirmPayment invoked successfully.");
    } catch (err) {
        console.error("Error invoking ConfirmPayment:", err);
        alert("Failed to confirm payment. Please try again.");
    }
};


export const cancelPayment = async (registryId) => {
    if (!paymentConnection) {
        console.warn("Payment connection is not initialized.");
        return;
    }
    try {
        await paymentConnection.invoke("CancelPayment", registryId);
        console.log("CancelPayment invoked successfully.");
    } catch (err) {
        console.error("Error invoking CancelPayment:", err);
        alert("Failed to cancel payment. Please try again.");
    }
};


/**
 * Retrieves online supporters from SupporterOnlineHub.
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
 * Sends a POST request to the API.
 * @param {string} path - API endpoint path.
 * @param {object} data - Data to send.
 * @param {boolean} fire - Whether to trigger notifications.
 */
export const postRegistryApi = async (path, data, fire = true) => {
    try {
        const response = await $.ajax({
            type: "POST",
            url: `${BASE_API_URL}/${path}`,
            data: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${getCookie("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        if (fire) autoNotification(response.statusCode, response.isSuccess, response.message);
        return response.data;
    } catch (err) {
        console.error("Error in POST:", err);
        return null;
    }
};

/**
 * Sends a GET request to the API.
 * @param {string} path - API endpoint path.
 */
export const getRegistryApi = async (path) => {
    try {
        const response = await $.ajax({
            type: "GET",
            url: `${BASE_API_URL}/${path}`,
            headers: {
                Authorization: `Bearer ${getCookie("registry-token")}`,
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error in GET:", err);
        return null;
    }
};

/**
 * Sends a PUT request to the API.
 * @param {string} path - API endpoint path.
 * @param {object} data - Data to update.
 */
export const updateRegistryApi = async (path, data, fire = true) => {
    try {
        const response = await $.ajax({
            type: "PUT",
            url: `${BASE_API_URL}/${path}`,
            data: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${getCookie("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        if (fire) autoNotification(response.statusCode, response.isSuccess, response.message);
        return response.data;
    } catch (err) {
        console.error("Error in PUT:", err);
        return null;
    }
};

// --------------------------------------- DOCUMENT READY ---------------------------------------

export const ready = new Promise((resolve) => {
    $(document).ready(async () => {
        console.log("document ready in main-registry.js");
        try {
            await getUserInformation;

            supporter = await getRegistryApi("Authorization/has-permission/supporter");

            $("#nav-container").append(supporter ? `<li class="nav-item"><a class="nav-link" href="./supporter-registry.html">پشتیبانی</a></li>` : "");
            if (window.location.href.indexOf("supporter-registry") > -1) $("li > a[href='./supporter-registry.html']").addClass("active");

            getAgentUserInformation.then(async parent => {
                await $.ajax({
                    type: "POST",
                    url: `${BASE_API_URL}/User`,
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify({
                        chatId: user_information.chatId,
                        firstName: user_information.firstName,
                        lastName: user_information.lastName,
                        userName: user_information.userName,
                        parent : {
                            chatId: parent.chatId,
                            firstName: parent.firstName,
                            lastName: parent.lastName,
                            userName: parent.userName,
                        }
                    }),
                    success: (response) => {
                        setCookie("registry-token", response.data, 820)
                    }
                });
            });

            await startAllSignalRConnections();
            const supporters = await getOnlineSupporters();
            REGISTRY_USER = await getRegistryApi("User/information",false);
            $("#balance").after( `<p class="tx-12 text-muted">${"کیف پول  رجیستری:" + (REGISTRY_USER.balance.toLocaleString() + " " + "تومان" || "ثبت نشده").replace("-", "منفی ")}</p>`);
            console.log("Online supporters:", supporters);
        } catch (err) {
            console.error("Error on document ready:", err);
        }

        resolve();
    });
});


/**
 * @function fixedRegistryStatus
 * @param {number} status
 * @returns {string} - HTML Badge
 */

export const fixedRegistryStatus = (status) => {
    switch (status) {
        case 1:
            return `<span class="badge bg-primary">در انتظار برسی پشتیبان</span>`;
        case 2:
            return `<span class="badge bg-info">در انتظار پرداخت</span>`;
        case 3:
            return `<span class="badge bg-danger">رد شده</span>`;
        case 4:
            return `<span class="badge bg-warning">در صف عملیات</span>`
        case 5:
            return `<span class="badge bg-success">اطلاعات گمرک ارسال شده</span>`;
    }
}
