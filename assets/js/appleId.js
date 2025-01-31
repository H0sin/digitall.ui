import * as main from "./main.js";


$(async function () {
    'use strict';

    let statusType = "null";
    let appleIdType = "null";
    let searchEmail = "null";
    let allEntitiesCount = 0;
    let currentPage = 1;
    let debounceTimeout;


    function formatBirthDate(birthDate) {
        let fullDate = new Date(birthDate);
        let getMonth = fullDate.getMonth() + 1;
        let getDate = fullDate.getDate();

        if (getMonth < 10) getMonth = "0" + getMonth;
        if (getDate < 10) getDate = "0" + getDate;

        return fullDate.getFullYear() + "/" + getMonth + "/" + getDate;
    }

    async function loadPage() {
        await filterAppleId();
        await fixedOption();
    }

    const getFilterAppleIdUrl = "/Apple/FilterAppleId";
    const addAppleIdUrl = "/Apple/AddAppleId";
    const getAppleIdType = "/Apple/GetAppleIdType";

    const appleIdTypeId = $("#appleIdTypeId");
    const appleIdForm = $("#add-apple-id-form");
    const table_body = $("#appleIdTable > tbody");
    const paginationContainer = $("#appleId_pagination_container");

    function createPagination(data) {
        const {page, pageCount} = data;

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
            <td>${formatBirthDate(obj.birthDay)}</td>
            <td>${obj.question1 ?? "-"}</td>
            <td>${obj.answer1 ?? "-"}</td>
            <td>${obj.question2 ?? "-"}</td>
            <td>${obj.answer2 ?? "-"}</td>
            <td>${obj.question3 ?? "-"}</td>
            <td>${obj.answer3 ?? "-"}</td>
            <td>${main.gregorianToJalali(obj.createDate ?? "-")}</td>
            <td>${main.gregorianToJalali(obj.modifiedDate ?? "-")}</td>
            <td>${obj.createBy ?? "-"}</td>
            <td>${obj.modifyBy ?? "-"}</td>
            <td>${obj.buyer ?? "-"}</td>
        </tr>`

        return row;
    }


    const fixedOption = async () => {
        await main.getDigitallApi(getAppleIdType , false).then(async result => {
            result.forEach(type => {
                appleIdTypeId.append(`<option value="${type.id}">${type.title}</option>`);
            });
        });
    }
    $("#type-apple-id").on("change", async function (e) {
        appleIdType = e.target.value;
        await main.showLoading();
        currentPage = 1;
        $("#appleIdTable > tbody").html('');
        await filterAppleId(currentPage);
        await main.hiddenLoading();
    });

    $("#status-apple-id").on("change", async function (e) {
        statusType = e.target.value;
        await main.showLoading();
        currentPage = 1;
        $("#appleIdTable > tbody").html('');
        await filterAppleId(currentPage);
        await main.hiddenLoading();
    });

    $("#appleId-table-filter").on("input", function (event) {
        searchEmail = event.target.value.trim();
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            currentPage = 1;
            $("#appleIdTable > tbody").html('');
            await main.showLoading();
            await filterAppleId(currentPage);
            await main.hiddenLoading();
        }, 500);
    });

    const filterAppleId = async (page = 1) => {
        let data = await main.getDigitallApi(`${getFilterAppleIdUrl}?takeEntity=10&page=${page}${statusType != "null" ? `&status=${statusType}` : ""}${appleIdType != "null" ? `&type=${appleIdType}` : ""}${searchEmail != "null" ? `&email=${searchEmail}` : ""}`, false);
        allEntitiesCount = data.allEntitiesCount;
        if (allEntitiesCount === 0) {
            $(table_body).html("<h4 class='text-center p-4'>هیچ اپل آی‌دی یافت نشد</h4>");
        } else {
            $(table_body).empty();
             $.each(data.entities, function(index, value) {
                 let row = generateRow(value);
                $(table_body).append(row);
                $("#allEntity").html("تعداد : " + allEntitiesCount)
            });
        }

        createPagination(data);
    }

    let appleId;
    const edit_appleId_Type_Id = $('#editAppleIdTypeId');
    const edit_status = $('#editStatus');
    const edit_email = $('#editEmail');
    const edit_phone = $('#editPhone');
    const edit_birthday = $('#editBirthday');
    const edit_password = $('#editPassword');
    const edit_question1 = $('#editQuestion1');
    const edit_answer1 = $('#editAnswer1');
    const edit_question2 = $('#editQuestion2');
    const edit_answer2 = $('#editAnswer2');
    const edit_question3 = $('#editQuestion3');
    const edit_answer3 = $('#editAnswer3');

    $('#edit_appleId_form_modal').on('shown.bs.modal', function () {
        flatpickr("#editBirthday", {
            dateFormat: "Y/m/d",
        });
    });

    $(document).on('dblclick', '#appleIdTable > tbody > tr', async function () {
        const appleIdRow = $(this);
        const id = appleIdRow.children('td').first().text();
        appleId = id;

        const response = await main.getDigitallApi(`/Apple/GetAppleIdById/${id}`, false);

        edit_appleId_Type_Id.val(response.appleIdTypeId);
        edit_email.val(response.email);
        edit_status.val(response.status);
        edit_phone.val(response.phone);
        edit_birthday.val(formatBirthDate(response.birthDay));
        edit_password.val(response.password);
        edit_question1.val(response.question1);
        edit_answer1.val(response.answer1);
        edit_question2.val(response.question2);
        edit_answer2.val(response.answer2);
        edit_question3.val(response.question3);
        edit_answer3.val(response.answer3);

        $("#edit_appleId_form_modal").modal('show');
    });

    $('#edit-apple-id-form').on("submit", async function (event) {
        event.preventDefault();

        let object = {
            id:appleId,
            appleIdTypeId: edit_appleId_Type_Id.val(),
            email: edit_email.val(),
            status: edit_status.val(),
            phone: edit_phone.val(),
            birthDay: edit_birthday.val(),
            password: edit_password.val(),
            question1: edit_question1.val(),
            answer1: edit_answer1.val(),
            question2: edit_question2.val(),
            answer2: edit_answer2.val(),
            question3: edit_question3.val(),
            answer3: edit_answer3.val(),
        };

        await main.updateDigitallApi(`/Apple/UpdateAppleId`, object);

        $("#edit_appleId_form_modal").modal('hide');
        await filterAppleId();
    });

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
                  await main.postDigitallApi(addAppleIdUrl, appleId);


                // window.location.reload();
            },
            errorPlacement: function (error, element) {
                error.addClass("invalid-feedback");

                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                    error.insertAfter(element.parent().parent());
                } else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                    error.appendTo(element.parent().parent());
                } else {
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
