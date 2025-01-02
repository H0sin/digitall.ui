"use strict";

import * as main from "./main.js";
import {getRegistryApi, paymentConnection, startAllSignalRConnections, ready, confirmPayment} from "./main-registry.js";
import {generateModal} from "./main.js";

// -------------------------------------------------------------------------------------
/**
 * modal for send price and link
 * @type {string}
 */
const price_link_form = `
  <form id="model_information_modal">
    <div class="mb-3">
        <label for="price" class="form-label">هزینه 0 تا 100</label>
        <input id="price" type="text" class="form-control">
    </div>
    <div class="mb-3">
        <label class="form-label">هزینه فقط پاسپورت</label>
        <input type="text" class="form-control">
    </div>
    <div class="mb-3">
        <label for="paymentLink" class="form-label">لینک پرداخت</label>
        <input id="paymentLink" type="text" class="form-control">
    </div>
    <div class="mb-3">
        <label for="uniqueId" class="form-label">شناسه یکتا</label>
        <div class="d-flex align-items-center">
            <input id="uniqueId" type="text" class="form-control" readonly hidden>
            <button type="button" class="btn btn-secondary ms-2" id="fetchUniqueId">دریافت شناسه یکتا</button>
        </div>
    </div>
    <div class="modal-footer">
        <button type="submit" class="btn btn-primary">ثبت</button>
        <button type="button" class="btn btn-danger ms-2" onclick="rejectRequest()">رد درخواست</button>
    </div>       
</form>
`;


/**
 * Returns an HTML badge representing the registry status.
 * @param {number} status - Numeric status code (e.g., 1, 2, etc.).
 * @returns {string} - HTML string for a badge.
 */
const fixedRegistryStatus = (status) => {
    switch (status) {
        case 1:
            return `<span class="badge bg-primary">منتظر بررسی پشتیبانی</span>`;
        case 2:
            return `<span class="badge bg-info">منتظر ارسال فایل</span>`;
        default:
            return `<span class="badge bg-secondary">وضعیت نامشخص</span>`;
    }
};

/**
 * Returns an HTML button (or disabled button) based on the registry status.
 * @param {number} status - Numeric status code.
 * @param {number} id - Registry ID.
 * @returns {string} - HTML string for a button element.
 */

const fixedRegistryButton = (status, id) => {
    switch (status) {
        case 1:
            return `<button id="model_information-${id}" class="btn btn-outline-primary">اعلام مدل</button>`;
        case 2:
            return `<button id="price-${id}" class="btn btn-outline-info">اعلام قیمت</button>`;
        default:
            return `<button class="btn btn-outline-secondary" disabled>وضعیت پشتیبانی نشده</button>`;
    }
};


/**
 * Generates an HTML snippet for a registry item in the admin panel.
 * @param {object} item - The registry object containing details.
 * @returns {string} - HTML string to display the registry item.
 */
function generateRegistryAdminItem(item) {
    return `
    <div id="registry-container-${item.id}" class="d-flex align-items-center border-bottom py-3">
      <div class="w-100">
        <div class="d-flex justify-content-between">
          <div id="registry-box-${item.id}">
            <p class="d-none" id="model-${item.id}">${item.model ?? ""}</p>
            <p class="d-none" id="forWho-${item.id}">${item.forWho ?? ""}</p>
            <p class="d-none" id="summery-${item.id}">${item.summery ?? ""}</p>
            
            <p class="text-body" id="imei-1-${item.imeI_1}">
              <span class="text-muted tx-13">IMEI 1: </span>${item.imeI_1}
            </p>
            ${
        item.imeI_2
            ? `<p class="text-body" id="imei-2-${item.imeI_2}">
                     <span class="text-muted tx-13">IMEI 2: </span>${item.imeI_2}
                   </p>`
            : ""
    }
            <p class="text-body mb-2">
              <span class="text-muted tx-13">وضعیت: </span>
              ${fixedRegistryStatus(item.status)}
            </p>
            ${
        item.phone
            ? `<p class="text-body" id="phone-${item.phone}">
                     <span class="text-muted tx-13">شماره تلفن: </span>${item.phone}
                   </p>`
            : ""
    }
            <p class="text-body mb-2">
              <span class="text-muted tx-13">تاریخ ثبت: </span>
              ${new Date(item.createDate).toLocaleString("fa-IR")}
            </p>
          </div>
          <div id="model_information-btn-${item.id}">
            ${fixedRegistryButton(item.status, item.id)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Document ready: main entry point
$(document).ready(async () => {

    await ready;
    //Modal Object
    const modals = {
        price_link_form_modal: {
            name: "price_and_link_form_modal",
            title: "اعلام اطلاعات پرداخت",
            body: price_link_form,
            form_id: "#model_information_modal"
        }
    }

    // Show loading indicator
    await main.showLoading();

    // await startAllSignalRConnections();

    // Grab the container where registry items will be appended
    const registriesContainer = $("#registries-container");


    /// get registries items


    let registries = await paymentConnection.invoke('GetAllRegistries');
    await $.each(registries, async function (index, payment) {
        registriesContainer.append(generateRegistryAdminItem(payment));

        // Set Event
        bindClickEventsToRegistries(payment.id);
    });

    /**
     * Listen for PaymentRegistered events from the PaymentHub connection.
     * Whenever a new payment is registered, log to console and optionally append it to the DOM.
     */
    paymentConnection.on("PaymentRegistered", (payment) => {
        // If you want to show this new payment in the admin list, uncomment:
        registriesContainer.append(generateRegistryAdminItem(payment));

        // Set Event
        bindClickEventsToRegistries(payment.id);
    });

    paymentConnection.on("PaymentUpdated", (payment) => {
        // Remove From Ui
        $(`#registry-container-${payment.id}`).remove();
    });


    // Hide the loading indicator when everything is set up
    await main.hiddenLoading();


    // Utilities
    function bindClickEventsToRegistries(id) {
        $(`#price-${id}`).click(function (e) {
            generateModal(modals.price_link_form_modal.name, modals.price_link_form_modal.title, modals.price_link_form_modal.body);

            let form = $(modals.price_link_form_modal.form_id);

            $("#fetchUniqueId").click(async function (e) {
                let uniqueId = await getRegistryApi(`Registry/SendUniqueId/${id}`);
                $('#uniqueId').val(uniqueId);
                $('#uniqueId').attr("hidden", false);
            });

            // submit form
            form.submit(async function (e) {
                e.preventDefault();

                let price = $('#price').val();
                let paymentLink = $('#paymentLink').val();
                await confirmPayment(id, +price, paymentLink);
            });
        });
    }
});