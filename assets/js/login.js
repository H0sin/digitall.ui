import {setCookie, postDigitallLogin, getDigitallApi} from "./main.js";

window.onload = function () {
    if (document.cookie.includes("token")) {
        window.location.href = "index.html";
    } else {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        let token = params.get("token");
        let login_form = $("#login_form");
        let isSubmitting = false;

        $(login_form).on("submit", function (e) {
            e.preventDefault();

            if (isSubmitting) return;

            isSubmitting = true;

            let chatId = $("#chatId").val();
            let password = $("#userPassword").val();

            postDigitallLogin("/User/Login", {chatId, password, email: ""}).then(function (response) {
                if (response && response.isSuccess) {
                    setCookie("token", response.data.token, 820);

                    getDigitallApi(`/Authorization/GetUserRolePermissions`, false).then(function (roles) {

                        if (Array.isArray(roles) && roles.length > 0) {
                            let rolesData = roles;

                            rolesData.forEach(role => {
                                let permissions = role.permissions;

                                if (permissions && permissions.length > 0) {
                                    let roleId = role.roleId;

                                    localStorage.setItem(`permissions_user_${roleId}`, JSON.stringify(permissions));
                                }
                            });
                        }

                        setTimeout(function () {
                            window.location.href = "index.html";
                        }, 2000);
                    });

                }

                isSubmitting = false;
            });

            isSubmitting = false;
        });
    }
};
