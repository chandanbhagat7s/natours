
// we will make the request to our api and login the user 

// adding the event listner 
// document.querySelector('.form')
//     .addEventListener("submit", function (event) {
//         // preventing form from submitting
//         event.preventDefault();
//         const email = document.getElementById('email').value
//         const password = document.getElementById('password').value

// console.log(email, password);


// for alerts

import { showAlert } from './alert';

export const call = (email, password) => {


    let option = {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }

    let p1 = fetch('http://127.0.0.1:3000/api/v1/user/login', option)
    p1.then((val, err) => {
        if (err) {
            return showAlert('error', err.massage)
        }
        return val.json()
    }).then((val) => {
        console.log("entred");
        console.log(val)
        showAlert('success', 'logged in successsfully')
        if (val.status === 'success') {
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)

        }
    })


}
// });

// now for logout we Need to make an api call 


export const logout = async () => {
    try {
        let option = {
            method: 'GET'
        }
        let p1 = await fetch('http://127.0.0.1:3000/api/v1/user/logout', option)
        console.log("resolved", p1);
        location.reload(true);
        if (p1.status === 200) {
            // we are reloding the same page 
            console.log("reloded");
        }
    } catch (err) {
        showAlert('error', err.massage)
    }

}
















