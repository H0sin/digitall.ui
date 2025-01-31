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
        $('form').html('');

        if (id) {
            const permissions = await getDigitallApi(`/Authorization/GetPermissionsForRole/role/${id}/permissions`, false);

            let list_ui = permissions.map(obj => check_box_generator(obj));

            $('form').append(list_ui);
        }
    })
}

const check_box_generator = ({permissionId, permissionName, isAssigned}) =>
    `<div class="form-check form-check-inline mt-2 mb-2">
         <input ${isAssigned ? 'checked' : ''} type="checkbox" name="skill_check" class="form-check-input" id="${permissionId}">
         <label class="form-check-label" for="${permissionId}">${permissionName}</label>
    </div>
`


function getUserId() {
    return new URLSearchParams(window.location.search).get('id');
}