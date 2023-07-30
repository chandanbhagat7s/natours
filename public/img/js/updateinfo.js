import { showAlert } from './alert';

export const updateInfo = async (name, email, id) => {


    let option = {
        method: 'PATCH',
        body: JSON.stringify({
            name,
            email
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }

    let p1 = await fetch(`http://127.0.0.1:3000/api/v1/user/updateMyself`, option)
    console.log(p1);
    if (p1.status == 200) {
        showAlert('success', 'changes applied')

        window.setTimeout(() => {
            location.reload(true)
        }, 1000)


    }


}