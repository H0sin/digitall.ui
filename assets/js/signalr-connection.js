// signalr-connection.js
"use strict";

import * as main from "./main.js";

// Define Base URLs
export const BASE_URL = "https://dev.samanii.com/";
export const BASE_API_URL = `${BASE_URL}api`;

export const HUB_SUPPORTER_ONLINE_URL = `${BASE_URL}supporterOnlineHub`;
export const HUB_PAYMENT_URL = `${BASE_URL}paymentHub`;

// Declare SignalR connections
export let paymentConnection = null;
export let supporterOnlineConnection = null;

// Flag to prevent multiple connection attempts
let isConnecting = false;

/**
 * Initializes and starts all SignalR connections.
 * Ensures that connections are only started once and handles reconnection logic.
 */
export const startAllSignalRConnections = async () => {
    if (isConnecting) {
        console.log("Already attempting to connect.");
        return;
    }

    isConnecting = true;

    try {
        // Load SignalR library if not already loaded
        if (!window.signalR) {
            await $.getScript("../assets/vendors/signalR/signalr.min.js");
            console.log("SignalR library loaded.");
        } else {
            console.log("SignalR library already loaded.");
        }

        // Create the PaymentHub connection
        paymentConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_PAYMENT_URL, {
                accessTokenFactory: () => localStorage.getItem("registry-token"),
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        // Create the SupporterOnlineHub connection
        supporterOnlineConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_SUPPORTER_ONLINE_URL, {
                accessTokenFactory: () => localStorage.getItem("registry-token"),
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        // Register event handlers for SupporterOnlineHub
        supporterOnlineConnection.on("UpdateSupporterOnline", (supporters) => {
            console.log("Online supporters updated:", supporters);
            if (supporters.length > 0) {
                $(".paymentPrice").removeAttr("disabled");
            } else {
                $(".paymentPrice").prop("disabled", true);
            }
        });

        // Register event handlers for PaymentHub
        paymentConnection.on("PaymentRegistered", (payment) => {
            console.log("PaymentRegistered:", payment);
            // Additional handling can be done in the main-registry.js
        });

        paymentConnection.on("PaymentUpdated", (payment) => {
            console.log("PaymentUpdated:", payment);
            // Additional handling can be done in the main-registry.js
        });

        paymentConnection.on("Error", (errorMessage) => {
            console.error("Error from PaymentHub:", errorMessage);
            alert(errorMessage);
        });

        // Start SupporterOnlineHub connection
        try {
            await supporterOnlineConnection.start();
            console.log("Connected to SupporterOnlineHub.");
        } catch (err) {
            console.error("Failed to connect to SupporterOnlineHub:", err);
        }

        // Start PaymentHub connection
        try {
            await paymentConnection.start();
            console.log("Connected to PaymentHub.");
        } catch (err) {
            console.error("Failed to connect to PaymentHub:", err);
        }

        // Handle reconnection events for PaymentHub
        paymentConnection.onreconnecting((error) => {
            console.warn(`PaymentHub connection lost due to error "${error}". Reconnecting...`);
        });

        paymentConnection.onreconnected((connectionId) => {
            console.log(`PaymentHub reconnected with connectionId "${connectionId}".`);
        });

        paymentConnection.onclose((error) => {
            console.error(`PaymentHub connection closed: ${error}`);
            // Optionally attempt to reconnect or notify the user
        });

        // Handle reconnection events for SupporterOnlineHub
        supporterOnlineConnection.onreconnecting((error) => {
            console.warn(`SupporterOnlineHub connection lost due to error "${error}". Reconnecting...`);
        });

        supporterOnlineConnection.onreconnected((connectionId) => {
            console.log(`SupporterOnlineHub reconnected with connectionId "${connectionId}".`);
        });

        supporterOnlineConnection.onclose((error) => {
            console.error(`SupporterOnlineHub connection closed: ${error}`);
            // Optionally attempt to reconnect or notify the user
        });

    } catch (err) {
        console.error("Error in starting SignalR connections:", err);
    } finally {
        isConnecting = false;
    }
};
