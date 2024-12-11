// // import * as api from "./main.js"

// // $(document).ready(function () {
// //   let currentPage = 1;
// //   let allUserCount = 0;

// //   async function loadUsers(page) {
// //     await api.getDigitallApi(`/Transaction/GetTransaction`).then(({ data }) => {

// //       let info_i = $(`<a
// //                   href="#"
// //                   class="d-flex align-items-center border-bottom p"  >
// //                  <div class="card" style="width: 18rem; margin: 10px;">
// //                      <img
// //                        src="./assets/images/images.jpg"
// //                        class="card-img-top"
// //                        alt="${user.name}"/>
// //                      <div class="card-body">
// //                       <h5 class="card-title">${user.name}</h5>
// //                       <p class="card-text">${user.description}</p>
// //                      </div>
// //         </div>
// //                  </a>`);

// //       $("#agentTransactions").append(info_i);
// //     });




// //   };


// // });











// async function loadUsers(page) {
//   const mockData = {
//     data: [
//       { id: 1, name: " نام کاربری", description: "توضیحات کاربر اول" },

//     ],
//   };

//   const { data: entities } = mockData;

// //   $.each(entities, function (index, user) {
// //     let info_i = $(`
// //       <div class="border-bottom py-3" >
// //         <div class="list-unstyled">
// //           <div class="my-4 d-flex flex-column-reverse align-items-start">
// //             <button type="button ">type</button>
// //               <img src="./assets/images/images.jpg" class="w-25 wd-sm-150 me-3" alt="${user.name}">
      
// //           </div>
// //           <div>
// //             <h5 class="mt-0 mb-1">${user.name}</h5>
// //             <p>${user.description}</p>
// //           </div>
// //         </div>
// //       </div>
      
// //         `);

// //     $("#agentTransactions").append(info_i);
// //   });
// // }

// $(document).ready(function () {
//   loadUsers(1);
// });


