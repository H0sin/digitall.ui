export const baseUrl = "https://test.samanii.com";
export const api_version = "1";
export const baseApiRequest = `${baseUrl}/api/v${api_version}`;

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE0MCIsIkJyYW5kSWQiOiIxMDAwMDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIiLCJDaGF0SWQiOiIxMjQ2MjExMzA1IiwiZXhwIjoxNzMxMzUwMzc2LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSJ9.bFX0KHYnPL8OFLG7mb0wp4KyfHdHXWQLZvoiNup3wGQ";

// start variable meessage information -------------------------------------------------------------------------

export const successTitle = "پیغام موفقیت";
export const successTheme = "success";
export const errorTitle = "پیغام خطا";
export const errorTheme = "error";
export const infoTitle = "پیغام اطلاع";
export const infoTheme = "info";
export const warningTitle = "پیغام هشدار";
export const warningTheme = "warning";

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

    const data = await response.json();

    if (data.isSuccess) {
      if (data.data) {
        localStorage.setItem("token", "bearer " + data.data);
        notificationMessage(successTitle, "خوش آمدید", successTheme);
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

// call with token ---------------------------------------------------------------

// post token from header ---------------------------------------------------------------
export const postDigitallApi = async (url, credentials) => {
  let response;

  await $.ajax({
    type: "POST",
    url,
    data: JSON.stringify(credentials),
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    success: async function (data) {
      //check if (data.statusCode != 0 | data.isSuccess == false) {}
      //todo : notification error for mserver message = data.message
      response = data;
    },
    erorr: async function (ex) { },
  });

  return response;
};

// get token from header ---------------------------------------------------------------
export const getDigitallApi = async (url) => {
  let response;
  await $.ajax({
    type: "GET",
    url,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    success: async function (result) {
      //check if (data.statusCode != 0 | data.isSuccess == false) {}
      //todo : notification error for mserver message = data.message
      response = result;
      // return response;
    },
    erorr: async function (ex) { },
  });

  return response;
};
