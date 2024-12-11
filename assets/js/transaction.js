// $(document).ready(async function () {

//     async function loadUsers(page) {
//         await api.getDigitallApi(`null`)
//             .then(({ data }) => {

//                 $.each(entities, function (index, user) {
//                     let info_i = $(`<div class="card">
//             <img
//               src="./assets/images/MainAfter.jpg"
//               class="card-img-top"
//               alt="..."
//             />
//             <div class="card-body">
//               <p class="card-text">
//                 لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم لورم ایپسوم متن
//                 ساختگی با تولید سادگی نامفهوم لورم ایپسوم
//               </p>
//             </div>
//           </div>`);

//                     $("#transaction-info").append(info_i);
//                 });
//             })

//     }


// <a class=" btn btn-outline-primary" href="./edit-users.html" role="button">مدیریت کاربر</a>

// await loadUsers(currentPage);

// $("#user-container").on("scroll", async function () {
//     const container = $(this);
//     const scrollHeight = container[0].scrollHeight;
//     const scrollTop = container.scrollTop();
//     const containerHeight = container.height();

//     if (scrollTop + containerHeight >= scrollHeight - 50) {
//         if ($("#user-container a").length >= allUserCount) {
//             return;
//         }
//         currentPage++;
//         await api.showLoading();
//         await loadUsers(currentPage);
//         await api.hiddenLoading();
//     }
// });
// });

async function loadUsers(page) {
    const mockData = {
        data: [
            { id: 1, name: "کاربر اول", description: "توضیحات کاربر اول" },
            { id: 2, name: "کاربر دوم", description: "توضیحات کاربر دوم" },
            { id: 3, name: "کاربر سوم", description: "توضیحات کاربر سوم" },
        ],
    };

    const { data: entities } = mockData;

    $.each(entities, function (index, user) {
        let info_i = $(`
          <div class="card" style="width: 18rem; margin: 10px;">
            <img
              src="./assets/images/images.jpg"
              class="card-img-top"
              alt="${user.name}"
            />
            <div class="card-body">
              <h5 class="card-title">${user.name}</h5>
              <p class="card-text">${user.description}</p>
            </div>
          </div>
        `);

        $("#transaction-info").append(info_i);
    });
}

$(document).ready(function () {
    loadUsers(1);
});
