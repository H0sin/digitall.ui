import * as api from "./main.js";
import {baseUrl} from "./main.js";

$(function() {
    $(':file').change(function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $('#profileImg').attr('src', e.target.result);
    $('#yourImage').attr('src', e.target.result);
    $('#profileSet').attr('src', e.target.result);
}


let first_name = $("#first-name");
let last_name = $("#last-name");
let mobile = $("#mobile");
let email = $("#email");
let address = $("#address");
let img_upload = $("#upload");

$(document).ready(async function () {
     api.getDigitallApi("/User/GetInformation" , false).then(( data ) => {
        let avatarPath = data.avatar;
        let cleanedAvatarPath = avatarPath ? avatarPath.replace('/app/wwwroot', baseUrl) : './assets/images/Users.jpg';
        $(first_name).val(data.firstName);
        $(last_name).val(data.lastName);
        // $(mobile).val(data.Mobile);
        // $(email).val(data.Email);
        // $(address).val(data.Address);
        $("#profileImg").attr('src', cleanedAvatarPath);
        $("#profileSet").attr('src', cleanedAvatarPath);
    });
});


$(async function () {
    'use strict';

    const edit_profile = $("#edit-profile");

    $(async function () {
        await edit_profile.validate({
            // rules: {
            //     firstName: {
            //         required: true,
            //         minlength: 3,
            //         maxlength: 9,
            //     },
            //     lastName: {
            //         required: true,
            //         number: true,
            //     },
            //     mobile: {
            //         required: true,
            //         number: true,
            //         range: [0, 500],
            //     }
            // },
            // messages: {
            //     firstName: {
            //         required: "لطفا نام خود را وارد کنید",
            //         minlength: "نام نباید کمتر از 3 کاراکتر باشد",
            //         maxlength: "نام نباید بیشتر از 9 کاراکتر باشد",
            //     },
            //     lastName: {
            //         required: "درصد نمایندگی نمیتواند خالی باشد",
            //         number: "درصد نمایندگی حتما باید عدد باشد",
            //         range: "درصد نمایندگی باید بین 0 و 75 باشد",
            //     },
            //     mobile: {
            //         required: "درصد نمایندگی نمیتواند خالی باشد",
            //         number: "درصد نمایندگی حتما باید عدد باشد",
            //         range: "درصد نمایندگی باید بین 0 و 500 باشد",
            //     }
            // },
            submitHandler: async function (form, event) {
                event.preventDefault();
               await api.showLoading();

                let obj = {
                    firstName: first_name.val(),
                    lastName: last_name.val(),
                    // Mobile: mobile.val(),
                    // Email: email.val(),
                    // Address: address.val(),
                    avatar: img_upload[0].files[0]
                }

                await api.updateProfileDigitallApi("/User/UpdateProfile", obj)

                window.location.href = "index.html"

               await api.hiddenLoading();
            },
            errorPlacement: function (error, element) {
                error.addClass("invalid-feedback");

                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                }
                else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                    error.insertAfter(element.parent().parent());
                }
                else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                    error.appendTo(element.parent().parent());
                }
                else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass) {
                if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                    $(element).addClass("is-invalid").removeClass("is-valid");
                }
            },
            unhighlight: function (element, errorClass) {

                if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
                    $(element).addClass("is-valid").removeClass("is-invalid");
                }
            }
        });

    });

});

