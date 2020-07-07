import React from 'react'

import './OAuth.css'

const OAuth = () => {
    return (
        <div className = 'OAuth-wrapper'>
            <div className = 'social-login-container' >
                <div className = 'app-description'>
                    <i className = 'fas fa-rocket' />
                    OAuth 2.0 Demo
                </div>
                <div className = 'login-details-text'>
                    Login using following to get quick access
                </div>
                <div className = 'social-login-wrapper'>
                    <div className = 'social-login google'>
                        <i className = 'fab fa-google-plus-g' />
                        Signin with Google
                    </div>
                    <div className = 'social-login facebook'>
                        <i className = 'fab fa-facebook-f' aria-hidden="true" />
                        Signin with Facebook
                    </div>
                    <div className = 'social-login twitter'>
                        <i className = 'fab fa-twitter' />
                        Signin with Twitter
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OAuth