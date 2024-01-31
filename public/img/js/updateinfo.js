import { showAlert } from './alert';

export const updateInfo = async (obj) => {


    let option = {
        method: 'PATCH',
        body: obj,

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