import axios from 'axios';

export const registerUser = async (name, email, password, role) => {
    let registerData = {name, email, password, role}
    let data = await axios('/api/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
        },
        data: registerData
    })
    return data
}

export const loginUser = async (email, password) => {
    let loginData = {email , password}
    let data = await axios('/api/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
        },
        data: loginData
    })
    return data
}

export const getRoles = async () => {
    let roles = await axios('/api/roles', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
        }
    })

    return roles
}