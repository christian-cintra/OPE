// MELHORAR DPS

export const estaLogado = () => {
    const token = window.localStorage.getItem('cintratoken');

    if(token)
        return true;
    else
        return false
}

export const fazerLogin = () => {
    window.localStorage.setItem('token', 'logado');
}

export const fazerLogout = () => {
    window.localStorage.removeItem('token');
}