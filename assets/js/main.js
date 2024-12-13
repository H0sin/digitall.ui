// ''

export const baseUrl = "https://test.samanii.com";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;

// start variable meessage information -------------------------------------------------------------------------

export const successTitle = "پیغام موفقیت";
export const successTheme = "success";
export const errorTitle = "پیغام خطا";
export const errorTheme = "error";
export const infoTitle = "پیغام اطلاع";
export const infoTheme = "info";
export const warningTitle = "پیغام هشدار";
export const warningTheme = "warning";

// ------------------------------------------------------ U T I L I T I E S -------------------------------------------------------


export const hiddenModal = () => {
    let show = $(".show");
    show.removeClass("show");
    show.css("display", "none");
    $(".modal-backdrop ").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
}

// ------------------------------------------------------- L O D I N G -------------------------------------------------------------

export const loadingContainer = $("#loading-container");
export const loading = $();

export async function showLoading() {
    await $(loadingContainer).toggleClass("d-none");
}

export async function hiddenLoading() {
    await $(loadingContainer).toggleClass("d-none");
}

//start variable meessage information---------------------------------------------------------------------------------------------------

export function notificationMessage(title, text, theme) {
    window.createNotification({
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: "nfc-bottom-right",
        showDuration: 4000,
        theme: theme !== "" ? theme : "success",
    })({
        title: title !== "" ? title : "اعلان",
        message: decodeURI(text),
    });
}

// end variable meessage information -------------------------------------------------------------------------

// start convert date ---------------------------------------------------------------------------------------

export function gregorianToJalali(dateString) {
    const gDate = new Date(dateString);
    gDate.setHours(0, 0, 0, 0);
    const offset = 226899;
    const jDate = new Date(gDate.getTime() - offset * 24 * 60 * 60 * 1000);

    return `${jDate.getFullYear()}/${(jDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${jDate.getDate().toString().padStart(2, "0")}`;
}


// end convert date ---------------------------------------------------------------------------------------

// start login api -------------------------------------------------------------------------------------------
export const DigitallLogin = async (action, credentials) => {
    try {
        const response = await fetch(baseUrl + action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data, isSuccess } = await response.json();

        if (isSuccess) {
            if (data) {
                localStorage.setItem("token", "bearer " + data.data);
                await notificationMessage(successTitle, "خوش آمدید", successTheme);
                console.log("Token stored in localStorage:", data.data);
            } else {
                console.warn("No token received.");
            }
        } else {
            notificationMessage(
                errorTitle,
                "کلمه عبور یا نام کاربری اشتباه است",
                errorTheme
            );
        }

        return data;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};

// end login api -------------------------------------------------------------------------------------------

// start post token from header ---------------------------------------------------------------------------

export const postDigitallApi = async (url, credentials) => {
    let response;

    await $.ajax({
        type: "POST",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: async function (data) {
            //check if (data.statusCode != 0 | data.isSuccess == false) {}
            //todo : notification error for mserver message = data.message
            response = data;
        },
        error: async function (ex) { },
    });

    return response;
};

// end post token from header ---------------------------------------------------------------------------

// start get token from header ---------------------------------------------------------------------------

export const getDigitallApi = async (url) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: baseApiRequest + url,
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            success: function (result) {
                resolve(result);
            },
            error: function (ex) {
                reject(ex);
            },
        });
    });
};

// end get token from header -----------------------------------------------------------------------------




// update method  token from header  -----------------------------------------------------------------------------

export const updateDigitallApi = async (url, credentials, id = 0) => {
    let response;
    await $.ajax({
        type: "PUT",
        url: baseApiRequest + url,
        data: JSON.stringify(credentials),
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: async function (result) {
            response = result;
        },
        error: async function (ex) { },
    });

    return response;
}



// --------------------------------------------------------------------------------------------------------



// start information -------------------------------------------------------------------------------------
// $(document).ready(async function () {
//     await showLoading();

//     let token = localStorage.getItem("token");
//     if (!token) {
//         const currentUrl = window.location.href;
//         const url = new URL(currentUrl);
//         const params = new URLSearchParams(url.search);
//         localStorage.setItem("token", "bearer " + params.get("token"));
//     }



//     //get agent information data
//     await getDigitallApi("/Agent/GetAdminAgentInformation").then(({ data }) => {
//         $(`#agent_information > div.card-body #agent-brand-name`).html(
//             "نمایندگی : " + data.brandName || "ثبت نشده"
//         );
//         $(`#agent_information > div.card-body #agent-code`).html(
//             "کد نمایندگی : " + data.agentCode
//         );
//         $(`#agent_information > div.card-body #agent-Percent`).html(
//             "درصد نمایندگان  : " + data.agentPercent || "ثبت نشده"
//         );
//         $(`#agent_information > div.card-body #user-Percent`).html(
//             "درصد کاربران  : " + data.userPercent || "ثبت نشده"
//         );
//     });

//     //get agent information payment
//     await getDigitallApi("/Transaction/GetTransactionDetail").then(({ data }) => {
//         $(`#Transaction-Detail > div.card-body #card-holder-name`).html(
//             " نام صاحب کارت : " + data.cardHolderName || "ثبت نشده"
//         );
//         $(`#Transaction-Detail > div.card-body #card-number`).html(
//             "شماره کارت : " + data.cardNumber || "ثبت نشده"
//         );
//         $(`#Transaction-Detail > div.card-body #maximum-payment`).html(
//             " سقف تراکنش نماینده : " + data.maximumAmountForAgent
//         );
//         $(`#Transaction-Detail > div.card-body #minimum-payment`).html(
//             " کف تراکنش نماینده :" + data.minimalAmountForAgent
//         );
//     });

//     await hiddenLoading();



//     // Growth Chart
//     if ($('#growthChart').length) {
//         await getDigitallApi("/Agent/ProfitReport?TakeEntity=0").then(({ data }) => {
//             const dailyProfits = {};
//             data.entities.forEach(item => {
//                 const date = item.createDate.split("T")[0];
//                 const jalaliDate = gregorianToJalali2(data);
//                 if (!dailyProfits[jalaliDate]) dailyProfits[jalaliDate] = 0;
//                 dailyProfits[jalaliDate] += item.profit;
//             });

//             const categories = Object.keys(dailyProfits);
//             const seriesData = Object.values(dailyProfits);


//             const options3 = {
//                 chart: {
//                     type: "line",
//                     height: 60,
//                     sparkline: {
//                         enabled: true
//                     }
//                 },
//                 series: [{
//                     name: 'سود روزانه',
//                     data: seriesData
//                 }],
//                 xaxis: {
//                     type: 'datetime',
//                     categories: categories,
//                 },
//                 stroke: {
//                     width: 2,
//                     curve: "smooth"
//                 },
//                 markers: {
//                     size: 0
//                 },
//                 colors: ['#0d6efd'], // رنگ دلخواه
//             };

//             new ApexCharts(document.querySelector("#growthChart"), options3).render();
//         });
//     }

// });
