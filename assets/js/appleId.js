import * as digitall from "./base-digitall.js";

$(async function () {
    'use strict';

    async function loadPage() {
        await filterAppleId();
        await fixedOption();
    }

    const getFilterAppleIdUrl = digitall.baseApiRequest + "/Apple/FilterAppleId";
    const addAppleIdUrl = digitall.baseApiRequest + "/Apple/AddAppleId";
    const getAppleIdType = digitall.baseApiRequest + "/Apple/GetAppleIdType";
    const appleIdTypeId = $("#appleIdTypeId");
    const appleIdForm = $("#add-apple-id-form");
    const table_body = $("#appleIdTable > tbody");
    const paginationContainer = $("#appleId_pagination_container");
    const get_appleId_by_Id = digitall.baseApiRequest + "/Apple/GetAppleIdById";

    function createPagination(data) {
        const { page, pageCount } = data;

        const $pagination = $("#appleId_pagination_container");
        $pagination.empty();

        if (page > 1) {
            $pagination.append(
                `<li class="paginate_button page-item">
                  <a href="#" class="page-link" data-page="${page - 1}">قبلی</a>
               </li>`
            );
        }

        const pageRange = getPageRange(page, pageCount);

        $.each(pageRange, function (_, pageNum) {
            const isActive = pageNum === page ? "active" : "";
            $pagination.append(
                `<li class="paginate_button page-item ${isActive}">
                <a href="#" class="page-link" data-page="${pageNum}">${pageNum}</a>
             </li>`
            );
        });

        if (page < pageCount) {
            $pagination.append(
                `<li class="paginate_button page-item">
                  <a href="#" class="page-link" data-page="${page + 1}">بعدی</a>
               </li>`
            );
        }

        $(".page-link").click(function (e) {
            e.preventDefault();
            const selectedPage = parseInt($(this).data("page"));
            filterAppleId(selectedPage);
            // loadPage(selectedPage);
        });
    }


    function getPageRange(currentPage, totalPages) {
        const range = [];
        const rangeSize = 5;
        const start = Math.max(1, currentPage - Math.floor(rangeSize / 2));
        const end = Math.min(totalPages, start + rangeSize - 1);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    }

    function generateRow(obj) {
        let row = `
        <tr>
            <td>${obj.id ?? "-"}</td>
            <td>${obj.email ?? "-"}</td>
            <td>${obj.phone ?? "-"}</td>
            <td>${obj.password ?? "-"}</td>
            <td>${obj.null ?? "-"}</td>
            <td>${obj.birthDay ?? "-"}</td>
            <td>${obj.question1 ?? "-"}</td>
            <td>${obj.answer1 ?? "-"}</td>
            <td>${obj.question2 ?? "-"}</td>
            <td>${obj.answer2 ?? "-"}</td>
            <td>${obj.question3 ?? "-"}</td>
            <td>${obj.answer3 ?? "-"}</td>
            <td>${digitall.gregorianToJalali(obj.createDate ?? "-")}</td>
            <td>${digitall.gregorianToJalali(obj.modifiedDate ?? "-")}</td>
            <td>${obj.createBy ?? "-"}</td>
            <td>${obj.modifyBy ?? "-"}</td>
        </tr>`

        return row;
    }

    const editAppleId = async () => {
        await digitall.getDigitallApi(get_appleId_by_Id).then()
    }


    const fixedOption = async () => {
        await digitall.getDigitallApi(getAppleIdType).then(async result => {
            result.data.forEach(type => {
                appleIdTypeId.append(`<option value="${type.id}">${type.title}</option>`);
            });
        });
    }

    const filterAppleId = async (page = 1) => {
        let query = `?page=${page}`
        await digitall.getDigitallApi(getFilterAppleIdUrl + query).then(async result => {
            $(table_body).html("");

            await $.each(result.data.entities, async function (index, value) {
                let row = generateRow(value);
                await $(table_body).append(row);
            });
            debugger;
            createPagination(result.data);

            const appleIdRow = $("#appleIdTable > tbody > tr");
            $(appleIdRow).css("cursor", "pointer");

            $(appleIdRow).dblclick(function () {
                $(this).css("background-color", "red");
                $("#edit_appleId_form_modal").modal('show');
            });
        });
    }




    $(async function () {

        await appleIdForm.validate({
            rules: {
                appleIdTypeId: {
                    required: true
                },
                // phone: {
                //     required: true,
                // },
                birthdate_content: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 5
                },
                comparePassword: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                },
                question_1: {
                    required: true
                },
                answer_1: {
                    required: true
                },
                question_2: {
                    required: true
                },
                answer_2: {
                    required: true
                },
                question_3: {
                    required: true
                },
                answer_3: {
                    required: true
                },
            },
            messages: {
                appleIdTypeId: "لطفا یک مورد را انتخاب کنید",

                // phone: {
                //     required: "لطفا شماره مبایل خود را وارد کنید"

                // },
                birthdate_content: "لطفا تاریخ تولد خود را انتخاب کنید"
                ,
                email: "لطفا یک آدرس ایمیل معتبر وارد کنید",

                password: {
                    required: "لطفا کلمه عبور خود را وارد کنید",
                    minlength: "طول کلمه عبور نباید کمتر از 5 کاراکتر باشد"
                },
                comparePassword: {
                    required: "لطفا تکرار کلمه عبور خود را وارد کنید",
                    minlength: "طول کلمه عبور نباید کمتر از 5 کاراکتر باشد",
                    equalTo: "لطفا تکرار کلمه عبور را صحیح وارد کنید"
                },

                question_1: "لطفا یک سوال را انتخاب کنید",
                answer_1: "لطفا یک جواب برای سوال خود انتخاب کنید",

                question_2: "لطفا یک سوال را انتخاب کنید",
                answer_2: "لطفا یک جواب برای سوال خود انتخاب کنید",

                question_3: "لطفا یک سوال را انتخاب کنید",
                answer_3: "لطفا یک جواب برای سوال خود انتخاب کنید",

            },
            submitHandler: async function (form, event) {
                event.preventDefault();
                let values = $("#add-apple-id-form input, #add-apple-id-form select");

                let appleId = {}

                values.each((key, value) => {
                    appleId[value.id] = value.value;
                });
                var response = await digitall.postDigitallApi(addAppleIdUrl, appleId);

                if (response.statusCode == 0 | response.isSuccess == true) {
                    digitall.notificationMessage(digitall.successTitle, response.message, digitall.successTheme)
                } else {
                    digitall.notificationMessage(digitall.errorTitle, response.message, digitall.errorTheme)
                }
                // window.location.reload();
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

        $.getScript("/assets/vendors/flatpickr/flatpickr.min.js", function (data, textStatus, jqxhr) {
            if ($('#birthdate-content').length) {
                flatpickr("#birthdate-content", {
                    wrap: true,
                    dateFormat: "Y/m/d",
                });
            }
        });
    });

    await loadPage();
});
