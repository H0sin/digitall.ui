import * as api from "./main.js";

$(document).ready(async function () {
    let currentPage = 1;
    let allUserCount = 0;
    let type_user = 0;
    let debounceTimeout;
    let username_filter = "";

    $("#type-user").on("change", async function (event) {
        type_user = event.target.value;
        await api.showLoading();
        currentPage = 1;
        $("#user-container").html("");
        await loadUsers(currentPage);
        await api.hiddenLoading();
    });


    $("#username-filter").on("input", function (event) {
        username_filter = event.target.value.trim();
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            currentPage = 1;
            $("#user-container").html("");
            await api.showLoading();
            await loadUsers(currentPage);
            await api.hiddenLoading();
        }, 300);
    });


    async function loadUsers(page) {
        await api.getDigitallApi(`/User/GetAgentUsersFilter?takeEntity=8&page=${page}&isAgent=${type_user}&userName=${username_filter}`,false)
            .then(({entities,allEntitiesCount}) => {
                allUserCount = allEntitiesCount;
                if (allUserCount > 0) {
                    $.each(entities, function (index, user) {
                        let user_info = $(`<a
                    href="./user-information.html?id=${user.id}"
                    class="d-flex align-items-center border-bottom py-3">
                    <div class="me-3">
                      <img
                        src="../assets/images/faces/face6.jpg"
                        class="rounded-circle wd-35"
                        alt="user"
                      />
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
                } else $("#user-container").append("<h4 class='text-center'>کاربری یافت نشد</h4>");
            })

    }


    // <a class=" btn btn-outline-primary" href="./edit-users.html" role="button">مدیریت کاربر</a>

    await loadUsers(currentPage);

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
            await api.showLoading();
            await loadUsers(currentPage);
            await api.hiddenLoading();
        }
    });
});