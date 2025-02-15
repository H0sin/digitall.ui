import { setCookie, postDigitallLogin, getDigitallApi, getCookie } from "./main.js";

window.onload = function () {
    if (getCookie("token")) {
        window.location.href = "index.html";
    } else {
        let login_form = $("#login_form");

        $(login_form).on("submit", function (e) {
            e.preventDefault();

            let chatId = $("#chatId").val();
            let password = $("#userPassword").val();

            postDigitallLogin("/User/Login", { chatId, password, email: "" }).then(function (response) {
                if (response && response.isSuccess) {
                    setCookie("token", response.data.token, 820);

                    getDigitallApi(`/Authorization/GetUserRolePermissions`, false).then(function (roles) {
                        let permissionsSet = new Set();

                        if (Array.isArray(roles) && roles.length > 0) {
                            roles.forEach(role => {
                                let permissions = role.permissions;
                                if (permissions && permissions.length > 0) {
                                    permissions.forEach(permission => {
                                        permissionsSet.add(permission.permissionName);
                                    });
                                }
                            });
                        }
                        localStorage.setItem(`permissions`, JSON.stringify(Array.from(permissionsSet)));

                        if (permissionsSet.size === 0) {
                            alert("شما دسترسی لازم را ندارید!");
                            location.reload();
                            return;
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
