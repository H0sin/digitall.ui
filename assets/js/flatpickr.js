
$(function() {
    'use strict';
    // let traveler_birthdate = null;
    //
    // $('#traveler_birthdate > input').change(async function (e) {
    //     const jalaliDate = e.target.value;
    //     let moment = jMoment(jalaliDate, 'jYYYY/jM/jD');
    //     traveler_birthdate = moment.format('YYYY/M/D');
    // });
    // date picker
    if($('#flatpickr-date').length) {
        flatpickr("#flatpickr-date", {
            wrap: true,
            dateFormat: "Y-m-d",
        });
    }


    // time picker
    if($('#flatpickr-time').length) {
        flatpickr("#flatpickr-time", {
            wrap: true,
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
        });
    }

});