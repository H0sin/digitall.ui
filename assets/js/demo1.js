import * as main from "./main.js";
//import {baseApiRequest} from "./main.js";

const baseUrl = "http://188.245.230.0:8080/api";


$(document).ready(async function () {

    //-------------------------------------------- token --------------------------------------------

    await main.getUserInformation();

    let user = main.user_information;

    let obj = {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.telegramUsername,
        chatId: user.chatId,
    }

    await $.ajax({
        type: "POST",
        url: baseUrl + "/User",
        data: JSON.stringify(obj),
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        success: async function ({data}) {
            localStorage.setItem("registry-token", "bearer " + data);
            console.log(localStorage.getItem("registry-token"));
            console.log(localStorage.getItem("token"));
        },
        error: async function (ex) {
        },
    });


});