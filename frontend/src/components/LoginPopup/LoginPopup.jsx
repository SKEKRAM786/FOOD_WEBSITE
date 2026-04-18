import React, { useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url,loadCartData } = useContext(StoreContext)

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKey = (e) => {
            if (e.key === 'Escape') setShowLogin(false)
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [setShowLogin])
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        const path = currState === "Login" ? "/api/user/login" : "/api/user/register";
        try {
            const response = await axios.post(url + path, data);
            if (response.data.success) {
                const jwt = response.data.token;
                localStorage.setItem("token", jwt);
                setToken(jwt);
                await loadCartData(jwt);
                setShowLogin(false);
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Network error — check that the API is running and VITE_API_URL is correct.";
            toast.error(msg);
        }
    }

    return (
        <div
            className='login-popup'
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-popup-heading"
            onClick={() => setShowLogin(false)}
        >
            <form
                onSubmit={onLogin}
                className="login-popup-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="login-popup-title">
                    <h2 id="login-popup-heading">{currState}</h2>
                    <button
                        type="button"
                        className="login-popup-close"
                        onClick={() => setShowLogin(false)}
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
