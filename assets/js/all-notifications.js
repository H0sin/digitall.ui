import * as api from "./main.js";
import {fixedFeatherIcon} from "./main.js";

$(document).ready(async function () {

    const notification_container_type = $("#notification-container-type");

    async function generateNotification(type) {
        let shortMessage = type.message.substring(0, 100);
        let expireDate = new Date(type.expire).toLocaleString("fa-IR");

        let notificationMessage = `
          <div class="d-flex align-items-start border-bottom py-3">
            <div class="me-3">
              <div class="d-flex w-100">
                <div class="icon-container d-flex align-items-center me-1 ">
                  ${fixedFeatherIcon(type.notificationType)}
                </div>
                <div class="w-100">
                  <div class="d-flex justify-content-between">
                    <h6 class="text-body mb-2">${shortMessage}...</h6>
                  </div>
                  <p class="text-muted tx-13">زمان پیام: ${expireDate}</p>
                </div>
              </div>
            </div>
          </div>`;

        if ([5, 11].includes(type.notificationType)) {
            notificationMessage = `
            <div class="d-flex align-items-start border-bottom py-3">
              <div class="me-3">
                <div class="d-flex w-100">
                  <div class="icon-container d-flex align-items-center me-1 ">
                    ${fixedFeatherIcon(type.notificationType)}
                  </div>
                  <div class="w-100">
                    <div class="d-flex justify-content-between">
                      <h6 class="text-body mb-2"><a href="/digitall.ui/transaction.html" target="_blank">${shortMessage}...</a></h6>
                    </div>
                    <p class="text-muted tx-13">زمان پیام: ${expireDate}</p>
                  </div>
                </div>
              </div>
            </div>`;
        }

        return notificationMessage;
    }

    async function loadNotifications() {
        let data = await api.getDigitallApi("/Notification/GetNotifications", false);

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let notificationMessage = await generateNotification(data[i]);
                notification_container_type.append(notificationMessage);
            }
        } else {
            notification_container_type.append(`<div class="px-3 py-2 text-center">هیچ تراکنشی وجود ندارد</div>`);
        }

        feather.replace();
    }

    await loadNotifications();

});
