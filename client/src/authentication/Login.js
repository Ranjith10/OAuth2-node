import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'

import { loginUser } from '../service/Api'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [passwordType, setPasswordType] = useState('password')

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        if (email.length === 0 || password.length === 0) {
            Swal.fire({
                title: 'Login Failed',
                text: 'Please fill in all the details',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok',
            })
        } else {
            try {
                let result = await loginUser(email, password)
                if (result.status === 200) {
                    // window.location.href = 'https://reactjs.org'
                    window.sessionStorage.setItem('token', result.data.token)
                    Swal.fire({
                        title: 'Login success',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                    })
                    setRole(result.data.role)
                }
            } catch (err) {
                Swal.fire({
                    title: 'Login Failed',
                    text: err.response.data.message,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                })
            }
        }
    }

    const handlePasswordToggle = () => {
        setIsPasswordVisible(!isPasswordVisible)
        passwordType === 'password'
            ? setPasswordType('input')
            : setPasswordType('password')
    }

    return (
        <div className="login-wrapper">
            <div className="app-title login"> Login to your account</div>
            <div className="other-user-actions login">
                <div className="sign-up-text">Don't have an account?</div>
                <NavLink to="/register">
                    <div className="sign-up">Sign up for app!</div>
                </NavLink>
            </div>
            <form onSubmit={handleLoginSubmit} autoComplete="off">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="email-input"
                        id="emailInput"
                        placeholder="Enter the registered E-mail"
                    />
                </div>
                <div className="pwd-input">
                    <input
                        type={passwordType}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="password-input"
                        id="passwordInput"
                        placeholder="Enter the password"
                    />
                    {isPasswordVisible ? (
                        <span
                            className="far fa-eye"
                            onClick={handlePasswordToggle}
                        />
                    ) : (
                        <span
                            className="far fa-eye-slash"
                            onClick={handlePasswordToggle}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    onClick={handleLoginSubmit}
                    className="login-submit-button"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
