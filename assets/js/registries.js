import * as main from "./main.js";


const fixedRegistryStatus = (status) => {
    switch (status) {
        case 0:
            return `<span class="badge bg-primary">در انتظار برسی پشتیبان</span>`;
    }
}

const fixedRegistryButton = (status) => {
    switch (status) {
        case 0:
            return `<button class="btn btn-outline-primary">اعلام قیمت و مدل</button>`
    }
}

function generateRegistryAdminItem(item) {
    return `<a href="./registry-information.html?id=${item.id}"
                    class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <div class="d-flex justify-content-around">
                                <div>
                                  <p class="text-body"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                                  ${item.imeI_2 ? `<p class="text-body"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                                  <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                                  ${item.phone ? `<p class="text-body"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                                  <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>
                                </div>
                                <div>
                                  ${fixedRegistryButton(item.status)}                                
                                </div>
                          </div>
                                      
                    </div>
                </a>`;
}

function generateRegistryItem(item) {
    return `<a href="./registry-information.html?id=${item.id}"
                    class="d-flex align-items-center border-bottom py-3">
                    <div class="w-100">
                          <p class="text-body"><span class="text-muted tx-13">IMEI 1 : </span>${item.imeI_1}</p>
                          ${item.imeI_2 ? `<p class="text-body"><span class="text-muted tx-13">IMEI 2 : </span>${item.imeI_2}</p>` : ""}
                          <p class="text-body mb-2"><span class="text-muted tx-13"> وضعیت : </span>${fixedRegistryStatus(item.status)}</p>
                          ${item.phone ? `<p class="text-body"><span class="text-muted tx-13">شماره : </span>${item.phone}</p>  ` : ""}   
                          <p class="text-body mb-2"><span class="text-muted tx-13">تاریخ ثبت : </span>${new Date(item.createDate).toLocaleString("fa-IR")}</p>               
                    </div>
                </a>`;
}

$(document).ready(async function (e) {
    await main.showLoading();

    let current_page = 1;
    let registries_container = $("#registries-container");

    async function loadRegistries(page) {
        let {statusCode,data} = await main.getDigitallApi("/Registry/FilterAll");

        if(statusCode != 403){
            await $.each(data.entities, async function (index, registry) {
                registries_container.append(generateRegistryAdminItem(registry));
            });
        }else if (statusCode == 403){
            let {statusCode , data} = await main.getDigitallApi("/Registry/Filter");
            await $.each(data.entities, async function (index, registry) {
                registries_container.append(generateRegistryItem(registry));
            });
        }

    }

    await loadRegistries(current_page);

    await main.hiddenLoading();
});
