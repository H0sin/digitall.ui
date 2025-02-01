import {setCookie, postDigitallLogin, getDigitallApi, getCookie} from "./main.js";

window.onload = function () {
    if (getCookie("token")) {
        window.location.href = "index.html";
    } else {
        let login_form = $("#login_form");

        $(login_form).on("submit", function (e) {
            e.preventDefault();

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
            });

        });
    }
};
