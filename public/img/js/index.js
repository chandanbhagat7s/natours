
// for support to old browsers 
import '@babel/polyfill';

// importing map module 
import { map } from './mapbox'
import { updateInfo } from './updateinfo';

// importing loggin module 

import { call, logout } from './login';

const maps = document.getElementById('map');
const logins = document.querySelector('.form')

const logsoutt = document.querySelector('.nav__el--logout');
// run for only when location is Needed

// now for updating info 
const updateinfotag = document.querySelector('.form-user-data')


if (updateinfotag) {
    console.log("entred");
    updateinfotag.addEventListener("submit", function (event) {
        // preventing form from submitting
        event.preventDefault();
        const id = document.getElementById('name').dataset
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value

        updateInfo(name, email, id)
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