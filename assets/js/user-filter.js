import {baseUrl, getDigitallApi, getUserInformation, component_access, showLoading, hiddenLoading} from "./main.js";

$(document).ready(async function () {

    showLoading();

    if ($("#user-container").length) {
        await component_access("user_container");
        showUsers()
    }

    if ($("#type-user").length) {
        await component_access("type_user");
        showType()
    }

    if ($("#username-search").length) {
        await component_access("username_search");
        showUserSearch()
    }

    hiddenLoading();

});

let currentPage = 1;
let allUserCount = 0;
let type_user = 0;
let debounceTimeout;
let username_filter = "";

function loadUsers(page) {
    getDigitallApi(`/User/GetAgentUsersFilter?takeEntity=8&page=${page}&isAgent=${type_user}&userName=${username_filter}`, false)
        .then(({entities, allEntitiesCount}) => {
            allUserCount = allEntitiesCount;
            if (allUserCount > 0) {
                $.each(entities, function (index, user) {
                    const userAvatarUrl = user.avatar
                        ? baseUrl + '/images/UserAvatar/thumb/' + user.avatar
                        : './assets/images/Users.jpg';
                    let user_info = $(`<a href="./user-information.html?id=${user.id}" class="d-flex align-items-center border-bottom py-3">
                                <div class="me-3">
                                    <img src="${userAvatarUrl}" class="rounded-circle wd-35" alt="user" />
                                </div>
                                   <div class="w-100">
                                      <div class="d-flex justify-content-between">
                                        <h6 class="text-body mb-2"><span class="text-muted tx-13"> نام کاربری : </span>${user.firstName}</h6>
                                        <p class="text-muted tx-12"><span class="text-muted tx-14">موجودی : </span>${user.balance.toLocaleString()}</p>
                                      </div>
                                        <h6 class="text-body mb-2"><span class="text-muted tx-13">  ایدی تلگرام : </span>${user.telegramUsername || " ثبت نشده"}</h6>
                                        <p class="text-muted tx-13">${user.isAgent ? "نماینده" : "کاربر عادی"}</p>
                                   </div>
                            </a>`);
                    $("#user-container").append(user_info);
                });
            } else {
                $("#user-container").append("<h4 class='text-center'>کاربری یافت نشد</h4>");
            }
        })

}

function showUsers() {
    loadUsers(currentPage);
    $("#user-container").on("scroll", async function () {
        const container = $(this);
        const scrollHeight = container[0].scrollHeight;
        const scrollTop = container.scrollTop();
        const containerHeight = container.height();

        if (scrollTop + containerHeight >= scrollHeight - 50) {
            if ($("#user-container a").length >= allUserCount) {
                return;
            }
            currentPage++;
            await showLoading();
            await loadUsers(currentPage);
            await hiddenLoading();
        }
    });
}

function showType() {
    $("#type-user").on("change", async function (event) {
        type_user = event.target.value;
        await showLoading();
        currentPage = 1;
        $("#user-container").html("");
        await loadUsers(currentPage);
        await hiddenLoading();
    });
}

function showUserSearch() {
    $("#username-filter").on("input", function (event) {
        username_filter = event.target.value.trim();
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            currentPage = 1;
            $("#user-container").html("");
            await showLoading();
            await loadUsers(currentPage);
            await hiddenLoading();
        }, 300);
    });
}