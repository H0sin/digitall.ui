import {getDigitallApi, updateDigitallApi} from "./main.js";

$(document).ready(async function () {
    const menuAuthorization = $("#menuAuthorization");
    trigger_roles_event();

    const id = getUserId();
    const roles = await getDigitallApi(`/Authorization/GetRolesForUser/user/${id}/roles`, false);

    let roles_option = generateRolesOptions(roles);
    menuAuthorization.append(roles_option);
    let permissions = [];

    $("button[type='submit']").click(async function () {
        let check_boxes = $('form input[type="checkbox"]');
        permissions = [];
        let roleId = $('#menuAuthorization').val();

        check_boxes.map((index, value) => {
            permissions.push({
                permissionId: +value.id,
                isAssigned: $(value).is(':checked'),
            })
        })

        await updateDigitallApi('/Authorization/UpdateRolePermissions/role/permissions', {
            permissions: permissions,
            roleId: +roleId
        });

    });


    const backButton = $('#backButton');
    backButton.attr('href', `user-information.html?id=${id}`);
});


function generateRolesOptions(roles) {
    let roles_options = '<option>لطفا یک آیتم را انتخاب کنید</option>';

    roles.map((role) => {
        roles_options += '<option value="' + role.roleId + '">' + role.roleName + '</option>';
    });

    return roles_options;
}

function trigger_roles_event() {
    $('#menuAuthorization').on('change', async function (e) {
        let id = e.target.value;

        if (!id || id === "لطفا یک آیتم را انتخاب کنید") {
            $('form').html('');
            return;
        }

        if (id) {
            const permissions = await getDigitallApi(`/Authorization/GetPermissionsForRole/role/${id}/permissions`, false);

            let list_ui = permissions.map(obj => check_box_generator(obj));

            $('form').append(list_ui);
        }
    })
}

const check_box_generator = ({ permissionId, title, isAssigned }) =>
    `<div class="col-sm-6 col-xl-3">
        <input ${isAssigned ? 'checked' : ''} type="checkbox" 
               name="skill_check" class="form-check-input" id="${permissionId}">
        <label class="form-check-label" data-bs-toggle="tooltip" data-bs-placement="top" title="${title}" for="${permissionId}" style="text-wrap: nowrap ; overflow: hidden; text-overflow: ellipsis ; max-width: 68%" >
            ${title}
        </label>
    </div>`;



function getUserId() {
    return new URLSearchParams(window.location.search).get('id');
}