
export const hideAlert = () => {
    let alerts = document.querySelector('.alert');
    if (alerts) alerts.parentElement.removeChild(alerts);
}

// type will be success or error
export const showAlert = (type, msg) => {
    hideAlert();

    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

    window.setTimeout(hideAlert, 5000);
}



















