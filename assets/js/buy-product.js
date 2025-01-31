import {getDigitallApi} from "./main.js";

$(document).ready(async function () {
    const all_product = $("#all-product");

    const response = await getDigitallApi(`/Product/GetProductByFilter`, false);

    if (response && response.entities && Array.isArray(response.entities)) {
        let product_option = generateRolesOptions(response.entities);
        all_product.html(product_option);
    }
});

function generateRolesOptions(products) {
    let product_option = '<option>لطفا یک آیتم را انتخاب کنید</option>';

    products.forEach((product) => {
        product_option += `<option value="${product.categoryId}">${product.productName}</option>`;
    });

    return product_option;
}
