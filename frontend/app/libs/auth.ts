export const getJwtToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userToken')
    }
}

export const saveJwtToken = (token: string) => {
    console.log(token)
    if (typeof window !== 'undefined') {
        localStorage.setItem('userToken', token)
    }
}

export const removeJwtToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken')
    }
}