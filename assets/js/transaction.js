import * as api from "./main.js";
import jMoment from 'https://cdn.skypack.dev/moment-jalaali';
import {component_access, notificationMessage, successTitle} from "./main.js";

function fixedTransactionType(type) {
    switch (type) {
        case 0:
            return `<span class="badge border border-light text-light">کاهش</span>`;
        case 1:
            return `<span class="badge border border-success text-success ">کارت به کارت</span>`;
        case 2:
            return `<span class="badge border border-success text-success ">افزایش دستی</span>`;
        case 3:
            return `<span class="badge border border-danger text-danger ">کاهش دستی</span>`;
        default:
            break;
    }
}

function fixedTransactionStatus(status) {
    switch (status) {
        case 1:
            return `<span class="badge border border-success text-success ">موفق</span>`;
        case 2:
            return `<span class="badge border border-danger text-danger">رد شده</span>`;
        case 3:
            return `<span class="badge border border-warning">منتظر تایید</span>`;
        default:
            break;
    }
}

function generateTransactionItem(item) {
    const backgroundImage = item.avatarTransaction.includes('jpg')
        ? `${api.baseUrl + "/" + item.avatarTransaction.replace('origin', 'thumb')}`
        : '';

    return `<div class="d-flex align-items-start border-bottom py-3">
                    <div class="me-3 d-flex">
                      <div class="d-flex container-transaction" style="background-image: url(${backgroundImage})">
                        <div class="bg-container-transaction"></div>
                        <button type="button"  id="details-id-${item.id}" class="btn btn-outline-primary btn-icon">جزئیات
                        </button>
                      </div>
                    </div>
                    <div class="w-100">
                      <div class="d-flex justify-content-between">
                        <h6 class="text-body mb-2"><span class="text-muted tx-13">تاریخ تراکنش : ${new Date(item.transactionTime).toLocaleString("fa-IR")}</span>
                        </h6>
                      </div>
                       <p class="text-muted my-1 tx-12"><span class="text-muted tx-14"> مبلغ :</span> ${item.price.toLocaleString()}</p>
                       <p class="text-muted my-2 tx-13">نوع پرداخت : ${fixedTransactionType(item.transactionType)}</p>
                       <p class="text-muted my-2 tx-13">وضعیت تراکنش : ${fixedTransactionStatus(item.transactionStatus)}</p>
                    </div>
                    </a>
                  </div>`;
}

$(document).ready(async function () {

    if ($("#edit-form").length) {
        await component_access("edit_form");
        showEditForm();
    }

    let type_transaction = "null";
    let currentPage = 1;
    let allEntitiesCount = 0;
    let status_transaction = "null";
    let end_date = "null";
    let start_date = "null";
    let debounceTimeout;
    let details_filter = "null";

    await api.showLoading();

    const transaction_container = $("#transaction-container");

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const id = params.get("id");

    if ($('#start-date').length) {
        $('#start-date > input').val("تاریخ شروع را انتخاب کنید");
    }

    if ($('#end-date').length) {
        $('#end-date > input').val("تاریخ پایان را انتخاب کنید");
    }

    $('#end-date > input').change(async function (e) {
        const jalaliDate = e.target.value;
        let moment = jMoment(jalaliDate, 'jYYYY/jM/jD');
        end_date = moment.format('YYYY/M/D');

        await api.showLoading();
        currentPage = 1;
        transaction_container.html('');
        await loadTransaction(currentPage);
        await api.hiddenLoading();
    });

    $('#start-date > input').change(async function (e) {
        const jalaliDate = e.target.value;
        let moment = jMoment(jalaliDate, 'jYYYY/jM/jD');
        start_date = moment.format('YYYY/M/D');
        await api.showLoading();
        currentPage = 1;
        transaction_container.html('');
        await loadTransaction(currentPage);
        await api.hiddenLoading();
    });

    $("#type-transaction").on("change", async function (e) {
        type_transaction = e.target.value;
        await api.showLoading();
        currentPage = 1;
        transaction_container.html('');
        await loadTransaction(currentPage);
        await api.hiddenLoading();
    });

    $("#status-transaction").on("change", async function (e) {
        status_transaction = e.target.value;
        await api.showLoading();
        currentPage = 1;
        transaction_container.html('');
        await loadTransaction(currentPage);
        await api.hiddenLoading();
    });

    $("#details-filter").on("input", function (event) {
        details_filter = event.target.value.trim();
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            currentPage = 1;
            transaction_container.html('');
            await api.showLoading();
            await loadTransaction(currentPage);
            await api.hiddenLoading();
        }, 500);
    });


    const loadTransaction = async (page) => {
        let {
            allEntitiesCount: counts,
            entities
        } = await api.getDigitallApi(`/Transaction/FilterTransaction?takeEntity=8&page=${page}${type_transaction != "null" ? `&type=${type_transaction}` : ""}${status_transaction != "null" ? `&status=${status_transaction}` : ""}${start_date != "null" ? `&startDate=${start_date}` : ""}${end_date != "null" ? `&endDate=${end_date}` : ""}${details_filter != "null" ? `&details=${details_filter}` : ""}${id ? `&userId=${id}` : ""}`, false);

        allEntitiesCount = counts;

        if (allEntitiesCount === 0) {
            transaction_container.append("<h4 class='text-center p-4'>تراکنشی یافت نشد</h4>");
        } else {
            await $.each(entities, function (index, entity) {
                let transaction = generateTransactionItem(entity);
                transaction_container.append(transaction);
            });
        }
    };

    if ($("#transaction-container").length) {
        await component_access("transaction_container");
        await loadTransaction(1);
    }

    if ($("#filter-transaction").length) {
        await component_access("filter_transaction");
        $("#type-transaction, #status-transaction, #start-date > input, #end-date > input, #details-filter").prop("disabled", false);
    }

    transaction_container.on("scroll", async function () {
        const container = $(this);
        const scrollHeight = container[0].scrollHeight;
        const scrollTop = container.scrollTop();
        const containerHeight = container.height();

        if (scrollTop + containerHeight >= scrollHeight - 50) {
            if ($("#transaction-container > div").length >= allEntitiesCount) {
                return;
            }
            currentPage++;
            await api.showLoading();
            await loadTransaction(currentPage);
            await api.hiddenLoading();
        }
    });

    await $(document).on("click", "[id^='details-id-']", async function () {
        await api.showLoading();

        const id = $(this).attr("id").replace("details-id-", " ");
        let data = await api.getDigitallApi(`/Transaction/GetTransaction/${id}`, false);

        if (data.avatarTransaction) {
            $("#avatar-transaction").attr("src", api.transactionImagePath(data.avatarTransaction));
            $("#avatar-transaction").removeClass("d-none");
        } else {
            $("#avatar-transaction").removeAttr("src");
            $("#avatar-transaction").addClass("d-none");
        }

        $("#user-id").html("ایدی عددی : " + (data.userId || "ثبت نشده"));
        $("#transaction-change").html("مبلغ درخواست : " + (data.price.toLocaleString() + " " + "تومان" || "ثبت نشده"));
        $("#title").html("نوع درخواست : " + fixedTransactionType((data.transactionType)));
        $("#transaction-time").html("زمان تراکنش : " + (new Date(data.transactionTime).toLocaleString("fa-IR")));
        $("#user-name").html("نام کاربری : " + (data.username || "ثبت نشده"));
        $("#first-name").html("نام : " + (data.firstName || "ثبت نشده"));
        $("#last-name").html("نام خانوادگی : " + (data.lastName || "ثبت نشده"));
        $("#description").html("توضیحات : " + (data.description ? data.description.trim() : "-"));

        const details_modal = $("#detailsModal");
        const details_user = $("#detailsUser");
        const modal_footer = $(".modal-footer");

        details_user.html("");
        modal_footer.html("");

        details_user.append(`<button type="button" class="btn btn-info" data-bs-dismiss="modal"><a href="user-information.html?id=${data.userId}">مشاهده اطلاعات کاربر</a></button>`);
        modal_footer.append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>`);
        let accept_button = `<button type="button" id="transaction-id-${data.id}" class="btn btn-success">تایید رسید</button>`;
        let reject_button = `<button type="button" id="transaction-id-${data.id}" class="btn btn-danger">عدم تایید</button>`;

        if (await component_access("update_transaction")) {
            if (data.transactionStatus == 3) {
                modal_footer.append(accept_button);
                modal_footer.append(reject_button);
            }
        }
        $(document).off("click", ".btn-success").on("click", ".btn-success", async function (e) {
            let transactionId = e.currentTarget.id.split("-")[2];

            await api.showLoading();
            await api.updateDigitallApi("/Transaction/UpdateTransactionStatus", {
                transactionId,
                transactionStatus: 1
            });

            transaction_container.html('');
            await loadTransaction(1);

            $("#detailsModal").modal("hide");
            await api.hiddenLoading();
        });

        $(document).off("click", ".btn-danger").on("click", ".btn-danger", async function (e) {
            let transactionId = e.currentTarget.id.split("-")[2];

            await api.showLoading();
            await api.updateDigitallApi("/Transaction/UpdateTransactionStatus", {
                transactionId,
                transactionStatus: 2
            });

            transaction_container.html('');
            await loadTransaction(1);

            $("#detailsModal").modal("hide");
            await api.hiddenLoading();
        });

        details_modal.modal('show');
        await api.hiddenLoading();
    });
    await api.hiddenLoading();
});