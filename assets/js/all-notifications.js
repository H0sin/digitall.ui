import * as api from "./main.js";
// import { getDigitallApi } from "./main.js";

$(document).ready(async function (e) {

  const notification_container_type = $("#notification-container-type");

  async function generateNotification(type) {
    return `<div class="d-flex align-items-start border-bottom py-3">
              <div class="me-3 d-flex">
                <div class="d-flex">
                  <div class="bg-container-transaction"></div>
                  <div>${type.message}</div>
                </div>
              </div>
            </div>`;
  }

  let input = $(`value="${e.target.message.replace("**", "")}"`);
  $(notification_container_type).append(input);

  async function loadNotifications() {


    let data = await api.getDigitallApi("/Notification/GetNotifications", false);

    const notificationCount = Math.max(data.length);

    if (data.length > 0) {
      for (let i = 0; i < notificationCount; i++) {
        let notificationMessage = await generateNotification(data[i]);
        notification_container_type.append(notificationMessage);
      }
    } else {
      notification_container_type.append(`<div class="px-3 py-2 text-center">هیچ تراکنشی وجود ندارد</div>`);
    }




  }
  await loadNotifications();

});
