import {setCookie, postDigitallLogin} from "./main.js";

window.onload = function () {
    if (document.cookie.includes('token')) {
        window.location.href = "index.html";

    } else {

        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        let token = params.get("token");
        let login_form = $("#login_form");

        let isSubmitting = false;

        $(login_form).on("submit", async function (e) {
            e.preventDefault();

            if (isSubmitting) return;

            isSubmitting = true;

            let chatId = $("#chatId").val();
            let password = $("#userPassword").val();
            chatId = JSON.parse(chatId);

            let response = await postDigitallLogin("/User/Login", {chatId, password, email: ''});

            if (response && response.isSuccess) {
                setCookie("token", response.data.token, 820);
                setInterval(async function () {
                    window.location.href = "index.html";
                }, 2000)
            }

            isSubmitting = false;
        });
    }
}



