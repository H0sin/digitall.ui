import {getDigitallApi, updateDigitallApi} from "./main.js";

$(document).ready(async function () {

    const id = getUserId();
    const roles = await getDigitallApi(`/Authorization/GetRolesForUser/user/${id}/roles`, false);
    console.log(roles);
    let forms = roles.map(({roleId, roleName, isAssigned}) => {
        return `
            <div class="form-check form-check-inline col-sm-6 col-xl-3">
                <input ${isAssigned ? "checked" : ""} type="checkbox" class="form-check-input" id="${roleId}">
                <label class="form-check-label" for="${roleId}">${roleName}</label>
            </div>`;
    });

    $("form").html(forms);

    $("button[type='submit']").click(async function () {
        let rolesToUpdate = [];

        $('form input[type="checkbox"]').each(function () {
            rolesToUpdate.push({
                roleId: +this.id,
                isAssigned: $(this).is(":checked"),
            });
        });

        await updateDigitallApi("/Authorization/UpdateUserRoles/user/roles", {
            userId: id,
            roles: rolesToUpdate,
        });
    });
    $("#backButton").attr("href", `user-information.html?id=${id}`);
});

function getUserId() {
    return new URLSearchParams(window.location.search).get("id");
}

