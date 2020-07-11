import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { NavLink } from 'react-router-dom'

import { registerUser, getRoles } from '../service/Api'
import './Register.css'

const customStyle = {
    control: (base, state) => ({
        ...base,
        border: 'none',
        display: 'flex',
        padding: 5,
        borderBottom: !state.isFocused
            ? '2px solid #657786'
            : '2px solid #1DA1F2',
        boxShadow: 'none',
        background: state.isFocused ? '#E8F0FE' : '#fff',
    }),
    option: (styles) => ({
        ...styles,
        paddingLeft: 15,
        height: 40,
    }),
}

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [name, setName] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [passwordType, setPasswordType] = useState('password')

    const handleRoleSelection = (selectedRole) => {
        setSelectedRole(selectedRole)
    }

    useEffect(() => {
        const fetchRoles = async () => {
            let roles = await getRoles()
            let formattedRoles = []
            roles.data.forEach((role) => {
                formattedRoles.push({ label: role.role, value: role.id })
            })
            setRoles(formattedRoles)
        }
        fetchRoles()
    }, [])

    const validateEmail = (event) => {
        let email = event.target.value
        let isEmailValid = new RegExp(
            /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
        ).test(`${email}`)
        setIsEmailValid(isEmailValid)
    }

    const handleFormValidation = () => {
        if (
            name.length > 0 &&
            email.length > 0 &&
            password.length > 0 &&
            repeatPassword.length > 0 &&
            selectedRole
        ) {
            if (isPasswordValid && isEmailValid) {
                return true
            } else if (!isEmailValid) {
                return false
            } else if (!isPasswordValid) {
                return false
            }
        }
        return false
    }

    const handleRegisterSubmit = async (event) => {
        event.preventDefault()
        let isFormValid = handleFormValidation()
        if (isFormValid) {
            try {
                let result = await registerUser(
                    name,
                    email,
                    password,
                    selectedRole.label,
                )
                if (result.status === 200) {
                    console.log(result)
                    Swal.fire({
                        title: 'Registration successful',
                        text:
                            'You have registered with us successfully!, Click Ok to take you to Login',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'Ok!',
                    }).then((result) => {
                        if (result.value) {
                            window.location.href = '/login'
                        }
                    })
                }
            } catch (err) {
                Swal.fire({
                    title: 'Registration failed',
                    text: 'Email id is already registered',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                })
            }
        } else {
            Swal.fire({
                title: 'Registration Failed',
                text: 'Please fill all the fields',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok',
            })
        }
    }

    const handleReenterPassword = (event) => {
        let repeatedPassword = event.target.value
        setRepeatPassword(repeatedPassword)
        if (repeatedPassword !== password) {
            setIsPasswordValid(false)
        } else {
            setIsPasswordValid(true)
        }
    }

    const handlePasswordToggle = () => {
        setIsPasswordVisible(!isPasswordVisible)
        passwordType === 'password'
            ? setPasswordType('input')
            : setPasswordType('password')
    }

    return (
        <div className = 'register-wrapper'>
            <div className = 'app-title'>Create your account</div>
            <form autoComplete = 'off' onSubmit = { handleRegisterSubmit }>
                <div>
                    <input
                        className = 'register-name-input'
                        onChange = { (e) => setName(e.target.value) }
                        placeholder = 'Enter your name'
                        required
                        type = 'text'
                        value = { name }
                    />
                </div>
                <div>
                    <input
                        className = 'register-email-input'
                        onBlur = { (e) => validateEmail(e) }
                        onChange = { (e) => setEmail(e.target.value) }
                        placeholder = 'Enter your E-mail'
                        required
                        type = 'email'
                        value = { email }
                    />
                </div>
                <div>
                    <Select
                        className = 'role-selection'
                        onChange = { handleRoleSelection }
                        options = { roles }
                        placeholder = 'Select a role'
                        styles = { customStyle }
                        value = { selectedRole }
                    />
                </div>
                <div>
                    <input
                        className = 'register-password-input'
                        onChange = { (e) => setPassword(e.target.value) }
                        placeholder = 'Enter your password'
                        required
                        type = 'password'
                        value = { password }
                    />
                </div>
                <div className = 're-enter-password'>
                    <input
                        className = 'register-password-input'
                        onBlur = { (e) => handleReenterPassword(e) }
                        onChange = { (e) => setRepeatPassword(e.target.value) }
                        placeholder = 'Re-Enter your password'
                        required
                        type = { passwordType }
                        value = { repeatPassword }
                    />
                    {isPasswordVisible ? (
                        <span
                            className = 'far fa-eye'
                            onClick = { handlePasswordToggle }
                        />
                    ) : (
                        <span
                            className = 'far fa-eye-slash'
                            onClick = { handlePasswordToggle }
                        />
                    )}
                </div>
                {!isEmailValid ? (
                    <div>Please enter a valid Email ID</div>
                ) : null}
                {!isPasswordValid ? (
                    <div>Passwords do not match, re-enter the password</div>
                ) : null}
                <button
                    className = 'register-submit-button'
                    onClick = { handleRegisterSubmit }
                    type = 'submit'
                >
                    Sign Up
                </button>
            </form>
            <div className = 'other-user-actions'>
                <div className = 'other-action-text'>
                    Already have an account!
                </div>
                <NavLink to = '/login'>
                    <div className = 'sign-up'>Login</div>
                </NavLink>
            </div>
        </div>
    )
}

export default Register
