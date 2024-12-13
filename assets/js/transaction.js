import * as api from "./main.js";


function fixedTransactionType(type) {
    switch (type) {
        case 0:
            return `<span class="badge border border-light text-light">کاهش</span>`
        case 1:
            return `<span class="badge border border-success text-success ">کارت به کارت</span>`
        case 2:
            return `<span class="badge border border-success text-success ">افزایش دستی</span>`
        case 3:
            return `<span class="badge border border-danger text-danger ">کاهش دستی</span>`
        default:
            break;
    }
}

function fixedTransactionStatus(status) {
    switch (status) {
        case 1:
            return `<span class="badge border border-success text-success ">موفق</span>`
        case 2:
            return `<span class="badge border border-danger text-danger">رد شده</span>`
        case 3:
            return `<span class="badge border border-warning">منتظر تایید</span>`
        default:
            break;
    }
}


function generateTransactionItem(item) {
    //   <h6 class="text-body mb-2"><span class="text-muted tx-13">نوع : ${item.title}</span></h6>
    return `<div class="d-flex align-items-start border-bottom py-3">
                    <div class="me-3 d-flex">
                      <div class="d-flex container-transaction">
                        <div class="bg-container-transaction"></div>
                        <button type="button" class="btn btn-outline-primary btn-icon">جزیات
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
    await api.showLoading();

    const transaction_container = $("#transaction-container");
    let currentPage = 1;
    let allEntitiesCount = 0;

    transaction_container.html('');

    const loadTransaction = async (page) => {
        let { data, isSuccess, statusCode } = await api.getDigitallApi(`/Transaction/FilterTransaction?takeEntity=6&page=${page}`);

        if (!isSuccess || statusCode != 0) api.notificationMessage(api.errorTitle, "مشکلی از سمت سرور رخ داد", api.errorTheme);

        allEntitiesCount = data.allEntitiesCount;

        $.each(data.entities, function (index, entity) {
            let transaction = generateTransactionItem(entity);
            transaction_container.append(transaction);
        });
    }

    await loadTransaction(1);

    await api.hiddenLoading();

    transaction_container.on("scroll", async function () {
        const container = $(this);
        const scrollHeight = container[0].scrollHeight;
        const scrollTop = container.scrollTop();
        const containerHeight = container.height();

        if (scrollTop + containerHeight >= scrollHeight - 50) {
            if ($("#user-container > div").length >= allEntitiesCount) {
                return;
            }
            currentPage++;
            await api.showLoading();
            await loadTransaction(currentPage);
            await api.hiddenLoading();
        }
    });
});