// // npm package: jquery-validation
// // github link: https://github.com/jquery-validation/jquery-validation

// $(async function () {
//   'use strict';

//   const edit_form = $("#edit-form");

//   $(async function () {

//     await edit_form.validate({
//       rules: {
//         brand: {
//           required: true,
//           minlength: 3,
//           maxlength: 10,
//         },
//         agentPercent: {
//           required: true,
//           minlength: 10,
//           maxlength: 70,
//         },
//         userPercent: {
//           required: true,
//           number: true,
//           range: [0, 500],
//         },
//         cardNumber: {
//           required: true,
//           minlength: 16,
//           maxlength: 16,
//         }
//       },
//       messages: {
//         brand: {
//           required: "لطفا نام خود را وارد کنید",
//           minlength: "نام نباید کمتر از 3 کاراکتر باشد",
//           maxlength: "نام کاربری خیلی است"
//         }
//       },
//       submitHandler: async function (form, event) {
//         event.preventDefault();
//         let values = $("#add-apple-id-form input, #add-apple-id-form select");

//         let appleId = {}

//         values.each((key, value) => {
//           appleId[value.id] = value.value;
//         });
//         var response = await digitall.postDigitallApi(addAppleIdUrl, appleId);

//         if (response.statusCode == 0 | response.isSuccess == true) {
//           digitall.notificationMessage(digitall.successTitle, response.message, digitall.successTheme)
//         } else {
//           digitall.notificationMessage(digitall.errorTitle, response.message, digitall.errorTheme)
//         }
//         // window.location.reload();
//       },
//       errorPlacement: function (error, element) {
//         error.addClass("invalid-feedback");

//         if (element.parent('.input-group').length) {
//           error.insertAfter(element.parent());
//         }
//         else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
//           error.insertAfter(element.parent().parent());
//         }
//         else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
//           error.appendTo(element.parent().parent());
//         }
//         else {
//           error.insertAfter(element);
//         }
//       },
//       highlight: function (element, errorClass) {
//         if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
//           $(element).addClass("is-invalid").removeClass("is-valid");
//         }
//       },
//       unhighlight: function (element, errorClass) {

//         if ($(element).prop('type') != 'checkbox' && $(element).prop('type') != 'radio') {
//           $(element).addClass("is-valid").removeClass("is-invalid");
//         }
//       }
//     });

//   });

// });

