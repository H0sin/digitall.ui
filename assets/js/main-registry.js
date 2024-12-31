"use strict";

// --------------------------------------- CONSTANTS & GLOBALS ---------------------------------------

export const BASE_URL = "http://localhost:8080/";
export const BASE_API_URL = `${BASE_URL}api`;
export const HUB_SUPPORTER_ONLINE_URL = `${BASE_URL}supporterOnlineHub`;
export const HUB_PAYMENT_URL = `${BASE_URL}paymentHub`;

export let paymentConnection = null;
let supporterOnlineConnection = null;
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
                    accessTokenFactory: () => localStorage.getItem("registry-token"),
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
                    accessTokenFactory: () => localStorage.getItem("registry-token"),
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
                Authorization: `Bearer ${localStorage.getItem("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        if (fire) console.log("Success:", response);
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
                Authorization: `Bearer ${localStorage.getItem("registry-token")}`,
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
export const updateRegistryApi = async (path, data) => {
    try {
        const response = await $.ajax({
            type: "PUT",
            url: `${BASE_API_URL}/${path}`,
            data: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${localStorage.getItem("registry-token")}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error in PUT:", err);
        return null;
    }
};

// --------------------------------------- DOCUMENT READY ---------------------------------------

$(document).ready(async () => {
    try {
        // debugger;
        // await startAllSignalRConnections();
        const supporters = await getOnlineSupporters();
        console.log("Online supporters:", supporters);
    } catch (err) {
        console.error("Error on document ready:", err);
    }
});
