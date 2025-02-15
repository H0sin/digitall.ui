import {getDigitallApi, gregorianToJalali, showLoading, hiddenLoading} from "./main.js";

$(document).ready(async function () {
    let currentPage = 1;
    let allProductCount = 0;

    const loadAllProducts = async () => {
        const response = await getDigitallApi(`/Product/GetProductByFilter`, false);
        if (response?.entities?.length) {
            let product_options = `<option value="null">لطفا یک محصول را انتخاب کنید</option>`;
            response.entities.forEach(product => {
                product_options += `<option value="${product.categoryId}">${product.productName}</option>`;
            });
            $("#all-product").html(product_options);
        }
    };

    async function loadProducts(page) {
        const response = await getDigitallApi(`/Order/FilterUserOrder?takeEntity=10&page=${page}`, false);
        if (!response || !response.entities || response.entities.length === 0) {
            if (currentPage === 1) {
                $("#product-container").html("<h4 class='text-center'>محصولی یافت نشد</h4>");
            }
            return;
        }

        allProductCount = response.allEntitiesCount;
        let productsHtml = "";

        response.entities.forEach((product) => {
            const orderDetail = product?.orderDetail?.[0] || {};
            const orderDetailType = orderDetail?.orderDeatilType;
            const username = orderDetail?.marzbanUsers?.[0]?.username || "-";
            const status = orderDetail?.marzbanUsers?.[0]?.status || "-";
            const created = orderDetail?.marzbanUsers?.[0]?.created_at || "-";

            productsHtml += `
                <div class="product-item card p-3 mb-3">
                    <p><strong>کاربر :</strong> ${product.userId ?? "-"}</p>
                    <p><strong>تاریخ پرداخت :</strong> ${product.paymentDate ? gregorianToJalali(product.paymentDate) : "-"}</p>
                    <p><strong>پرداخت : </strong${product.isPaid ? `<i data-feather="check-circle" class="text-success ms-1" style="width: 18px ; height: 18px" ></i>` : `<i data-feather="x-circle" class="text-danger ms-1" style="width: 18px ; height: 18px" ></i>`}</p>
                    <p><strong>کد پیگیری :</strong> ${product.tracingCode ?? "-"}</p>
                    <p class="mb-2"><strong>توضیحات :</strong> ${product.description ?? "-"}</p>${orderDetailType == 1 ? `<div class="d-flex align-items-center"> <span>نمایش جزئیات : </span>
                        <button class="btn btn-outline-primary rounded-pill btn-sm ms-1 p-0" data-bs-toggle="collapse" data-bs-target="#collapse-${orderDetail?.id}" style=" width: 18px ;  height: 18px">
                    <i class="link-arrow" data-feather="chevron-down" style="width: 12px ; height: 12px" ></i>
                        </button>
                </div>
                <div class="collapse mt-2" id="collapse-${orderDetail?.id}">
                    <p><strong> ایدی عددی : </strong> ${orderDetail.id}</p>
                    <p><strong> نام کاربری : </strong> ${username}</p>
                    <p><strong> قیمت : </strong> ${(orderDetail.productPrice.toLocaleString() + " " + "تومان" || "ثبت نشده")}</p>
                    <p><strong> وضعیت : </strong> ${status}</p>
                    <p><strong> تاریخ درخواست : </strong> ${gregorianToJalali(created)}</p>
                </div>` : "<div><strong class='text-info'>جزئیات :  </strong><p><strong> قیمت : </strong> " + (orderDetail.productPrice ? orderDetail.productPrice.toLocaleString() + " تومان" : "ثبت نشده") + "</p> </div>"}</div>`;
        });
        $("#product-container").append(productsHtml);
    }

    $("#product-container").on("scroll", async function () {
        const container = $(this);
        const scrollHeight = container[0].scrollHeight;
        const scrollTop = container.scrollTop();
        const containerHeight = container.height();

        if (scrollTop + containerHeight >= scrollHeight - 50) {
            if ($("#product-container .product-item").length >= allProductCount) {
                return;
            }
            currentPage++;
            await showLoading();
            await loadProducts(currentPage);
            feather.replace();
            await hiddenLoading();
        }
    });

    await loadProducts(currentPage);
    feather.replace();
    await loadAllProducts();
});
