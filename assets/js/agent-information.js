import {setCookie, showLoading, hiddenLoading, getDigitallApi, component_access, user_information} from "./main.js";

'use strict'

$(document).ready(async function () {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    let token = params.get("token");
    let registry = params.get("registry");
    if (token) setCookie("token", token, 820);
    if (registry) location.href = "registry/registry.html";

    showLoading();

    if ($("#service_chart").length) {
        await component_access("service_chart");
        showService()
    }

    if ($("#profit_chart").length) {
        await component_access("profit_chart");
        showProfit()
    }

    if ($("#agent_information_details").length) {
        await component_access("agent_information_details");
        showAgentInformation()
    }

    if ($("#agent_transaction_detail").length) {
        await component_access("agent_transaction_detail");
        showAgentTransaction()
    }

    if ($("#edit_agent_information").length) {
        await component_access("edit_agent_information");
        showEditButton()
    }

    if ($("#access-apps").length) {
        await component_access("access_v2ray");
        showV2rayNGButton()
    }

    if ($("#access-apps").length) {
        await component_access("access_wireguard");
        showWireGuardButton()
    }

    if ($("#access-apps").length) {
        await component_access("access_apple_id");
        showAppleIdButton()
    }

    if ($("#access-apps").length) {
        await component_access("access_registry");
        showRegistryButton()
    }

    hiddenLoading();

});

function showV2rayNGButton() {
    $("#access-apps").append(`
           <div class="col-3 text-center">
                <a href="#"
                     class="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"><i
                     data-feather="check-circle" class="icon-lg mb-1"></i>
                     <p class="tx-12">v2rayNG</p>
                </a>
           </div>
        `);
}

function showWireGuardButton() {
    $("#access-apps").append(`
           <div class="col-3 text-center">
                 <a href="#"
                      class="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"><i
                      data-feather="zap" class="icon-lg mb-1"></i>
                      <p class="tx-12">WireGuard</p>
                 </a>
           </div>
        `);
}

function showAppleIdButton() {
    $("#access-apps").append(`
           <div class="col-3 text-center">
                <a href="appleId.html"
                    class="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"><i
                    data-feather="navigation" class="icon-lg mb-1"></i>
                    <p class="tx-12">AppleID</p>
                </a>
            </div>
        `);
}

function showRegistryButton() {
    $("#access-apps").append(`
           <div class="col-3 text-center">
                 <a href="registry/registry.html"
                     class="dropdown-item d-flex flex-column align-items-center justify-content-center wd-70 ht-70"><i
                     data-feather="plus" class="icon-lg mb-1"></i>
                     <p class="tx-12">Registry</p>
                 </a>
           </div>
        `);
}

function showService() {
    if ($('#total_inventory').length) {

        let data = user_information;

        const totalMax = data.agency.amountWithNegative;

        let usedPercentage = 0;

        if (data.balance < 0) {
            usedPercentage = (data.balance * 100) / data.agency.amountWithNegative;
        }

        const options = {
            chart: {
                type: "radialBar",
                height: 200,
            },
            series: [usedPercentage],
            labels: ['استفاده‌شده'],
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '18px',
                            fontWeight: 'bold',
                        },
                        value: {
                            fontSize: '20px',
                            fontWeight: 'bold',
                            formatter: function (val) {
                                return `${Math.round(val)}%`;
                            }
                        },
                    },
                    hollow: {
                        size: '80%',
                    },
                    track: {
                        background: '#dad3d3',
                        strokeWidth: '100%',
                    },
                },
            },
            colors: ['#0067ff'],
            stroke: {
                lineCap: 'round',
            },
        };

        var chart = new ApexCharts(document.querySelector("#total_inventory"), options);
        chart.render();

        const totalStorageText = `${data.balance.toLocaleString()} تومان`;
        const purchasedStorageText = `${totalMax.toLocaleString()} تومان`;

        $("#total_storage_display").text(totalStorageText);
        $("#negative_storage_display").text(purchasedStorageText);
    }
}

function showProfit() {

    function gregorian_to_jalali(gy, gm, gd) {
        var g_d_m, jy, jm, jd, gy2, days;
        g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        gy2 = (gm > 2) ? (gy + 1) : gy;
        days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        jy = -1595 + (33 * ~~(days / 12053));
        days %= 12053;
        jy += 4 * ~~(days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += ~~((days - 1) / 365);
            days = (days - 1) % 365;
        }
        if (days < 186) {
            jm = 1 + ~~(days / 31);
            jd = 1 + (days % 31);
        } else {
            jm = 7 + ~~((days - 186) / 30);
            jd = 1 + ((days - 186) % 30);
        }
        return [jy, jm, jd];
    }

    if ($('#agentProfit').length) {
        getDigitallApi("/Agent/ProfitReport?TakeEntity=0", false).then((data) => {
            const dailyProfits = {};
            let totalProfits = 0;
            let growPercent = 0;

            data.entities.forEach(item => {
                const gregorianDate = item.createDate;
                const dateParts = gregorianDate.split('T')[0];
                const [gy, gm, gd] = dateParts.split('-').map(Number); // Convert Gregorian date to components
                const [j_y, j_m, j_d] = gregorian_to_jalali(gy, gm, gd); // Convert to Jalali date
                const jalaliDate = `${j_y}/${(j_m).toString().padStart(2, "0")}/${j_d.toString().padStart(2, "0")}`; // Format the Jalali date
                if (!dailyProfits[jalaliDate]) dailyProfits[jalaliDate] = 0;
                dailyProfits[jalaliDate] += item.profit; // Add profit to the specific date
            });

            const categories = Object.keys(dailyProfits).reverse();
            const seriesData = Object.values(dailyProfits).reverse();

            totalProfits = seriesData.reduce((sum, value) => sum + value, 0);

            if (seriesData.length > 1) {
                const firstValue = seriesData[0]
                const lastValue = seriesData[seriesData.length - 1];
                growPercent = ((lastValue - firstValue) / firstValue) * 100;
            } else if (seriesData.length < 1) {
                growPercent = 0;
            }
            const growth_profit = $("#growth_profit");

            if (growPercent >= 0) {
                growth_profit.parent().addClass("text-success");
                growth_profit.html(`${growPercent.toFixed(3)} %`);
                growth_profit.parent().append(`<i data-feather="arrow-up" class="icon-sm"></i>`);
            } else {
                growth_profit.parent().addClass("text-danger");
                growth_profit.html(`${growPercent.toFixed(3)} %`);
                growth_profit.parent().append(`<i data-feather="arrow-down" class="icon-sm"></i>`);
            }

            feather.replace();

            $("#sales_profit").text(`${totalProfits.toLocaleString()} تومان `)
            growth_profit.text(`${growPercent.toFixed(3)} %`);

            const options = {
                chart: {
                    type: "line",
                    height: 60,
                    sparkline: {
                        enabled: true
                    }
                },
                series: [{
                    name: 'سود روزانه',
                    data: seriesData
                }],
                xaxis: {
                    type: 'روز',
                    categories: categories,
                },
                stroke: {
                    width: 1,
                    curve: "smooth"
                },
                markers: {
                    size: .05
                },

                colors: ['#0d6efd'],
            };

            new ApexCharts(document.querySelector("#agentProfit"), options).render();
        });
    }
}

function showAgentInformation() {
    getDigitallApi("/Agent/GetAdminAgentInformation", false).then((data) => {
        $(`#agent_information > div.card-body #agent-brand-name`).html(
            "نمایندگی : " + data.brandName || "ثبت نشده"
        );
        $(`#agent_information > div.card-body #agent-code`).html(
            "کد نمایندگی : " + data.agentCode
        );
        $(`#agent_information > div.card-body #agent-Percent`).html(
            "درصد نمایندگان  : " + data.agentPercent || "ثبت نشده"
        );
        $(`#agent_information > div.card-body #user-Percent`).html(
            "درصد کاربران  : " + data.userPercent || "ثبت نشده"
        );
    });
}

function showAgentTransaction() {
    getDigitallApi("/Transaction/GetTransactionDetail", false).then((data) => {
        $(`#transaction_detail > div.card-body #card-holder-name`).html(
            " نام صاحب کارت : " + (data.cardHolderName || "ثبت نشده")
        );
        $(`#transaction_detail > div.card-body #card-number`).html(
            "شماره کارت : " + (data.cardNumber || "ثبت نشده")
        );
        $(`#transaction_detail > div.card-body #maximum-payment`).html(
            " سقف تراکنش نماینده : " + data.maximumAmountForAgent
        );
        $(`#transaction_detail > div.card-body #minimum-payment`).html(
            " کف تراکنش نماینده :" + data.minimalAmountForAgent
        );
    });
}

function showEditButton() {
    $("#edit_agent_information").html(`
        <div class="col grid-margin stretch-card">
            <a class="w-100 btn btn-primary" href="edit-agent.html" role="button">
                <i data-feather="edit"></i> ویرایش اطلاعات نمایندگی
            </a>
        </div>`);
}