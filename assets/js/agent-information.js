import * as api from "./main.js";

'use stric'

$(document).ready(async function () {
    await api.showLoading();

    let token = localStorage.getItem("token");
    if (!token) {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        localStorage.setItem("token", "bearer " + params.get("token"));
    }


    //get agent information data
    await api.getDigitallApi("/Agent/GetAdminAgentInformation").then(({ data }) => {
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

    //get agent information payment
    await api.getDigitallApi("/Transaction/GetTransactionDetail").then(({ data }) => {
        $(`#Transaction-Detail > div.card-body #card-holder-name`).html(
            " نام صاحب کارت : " + data.cardHolderName || "ثبت نشده"
        );
        $(`#Transaction-Detail > div.card-body #card-number`).html(
            "شماره کارت : " + data.cardNumber || "ثبت نشده"
        );
        $(`#Transaction-Detail > div.card-body #maximum-payment`).html(
            " سقف تراکنش نماینده : " + data.maximumAmountForAgent
        );
        $(`#Transaction-Detail > div.card-body #minimum-payment`).html(
            " کف تراکنش نماینده :" + data.minimalAmountForAgent
        );
    });

    await api.hiddenLoading();


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
        await api.getDigitallApi("/Agent/ProfitReport?TakeEntity=0").then(({ data }) => {
            const dailyProfits = {};

            data.entities.forEach(item => {
                const gregorianDate = item.createDate;
                const dateParts = gregorianDate.split('T')[0];
                const [gy, gm, gd] = dateParts.split('-').map(Number); // Convert Gregorian date to components
                const [j_y, j_m, j_d] = gregorian_to_jalali(gy, gm, gd); // Convert to Jalali date
                const jalaliDate = `${j_y}/${(j_m).toString().padStart(2, "0")}/${j_d.toString().padStart(2, "0")}`; // Format the Jalali date
                // debugger;
                // If the Jalali date doesn't exist yet, add it
                if (!dailyProfits[jalaliDate]) dailyProfits[jalaliDate] = 0;
                dailyProfits[jalaliDate] += item.profit; // Add profit to the specific date
            });

            // Extract the categories (dates) and series data (profits)
            const categories = Object.keys(dailyProfits).reverse();
            const seriesData = Object.values(dailyProfits).reverse();

            // Chart options
            const options3 = {
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
                    type: 'روز', // Changed to category type
                    categories: categories, // Use dates as categories
                },
                stroke: {
                    width: 2,
                    curve: "smooth"
                },
                markers: {
                    size: 0
                },
                colors: ['#0d6efd'], // Custom color
            };

            // // Render the chart
            new ApexCharts(document.querySelector("#agentProfit"), options3).render();
        });
    }

});