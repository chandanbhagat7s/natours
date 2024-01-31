
// for support to old browsers 
import '@babel/polyfill';

// importing map module 
import { map } from './mapbox'
import { updateInfo } from './updateinfo';

// importing loggin module 

import { call, logout } from './login';

const maps = document.getElementById('map');
const logins = document.querySelector('.form-login')

const logsoutt = document.querySelector('.nav__el--logout');
// run for only when location is Needed

// now for updating info 
const updateinfotag = document.querySelector('.form-user-data')


if (updateinfotag) {
    console.log("entred");
    updateinfotag.addEventListener("submit", function (event) {
        // preventing form from submitting
        event.preventDefault();
        // we Need to send form data 
        const form = new FormData();
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])

        // const values = [...form.entries()];
        // // console.log(values);
        // const obj = Object.fromEntries(values);
        // console.log(obj);

        updateInfo(form)
        // const id = document.getElementById('name').dataset
        // const apiUrl = 'http://127.0.0.1:3000/api/v1/user/updateMyself'; // Replace with the actual API endpoint
        // fetch(apiUrl, {
        //     method: 'PATCH',
        //     body: form
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('API response:', data);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });
    })


}

if (maps) {
    const locationv = JSON.parse(maps.dataset.locations)
    map(locationv)

}


if (logins) {

    logins
        .addEventListener("submit", function (event) {
            // preventing form from submitting
            event.preventDefault();
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value

            call(email, password)
        })


}

// listning the event for logout 
if (logsoutt) {
    logsoutt.addEventListener('click', () => {
        logout()
    })
}



// console.log("hellow from parcel");