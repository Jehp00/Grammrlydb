import { useEffect } from 'react';

function Login() {
    document.title = "Iniciar Sesion";

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (user) {
            document.location.href = "/";
        }
    }, []);

    const loginHandle = async (e) => {
        e.preventDefault();
        const form_ = e.target;

        const formData = new FormData(form_), dataToSend = {};

        for (const [key, value] of formData.entries()) {
            dataToSend[key] = value;
        }

        if (dataToSend.Remember === "on") {
            dataToSend.Remember = true;
        }

        const res = await fetch("api/SecureWeb/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(dataToSend),
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("user", dataToSend.email);  // Store user email in localStorage
            document.location.href = "/";
        }

        const message = document.querySelector(".message");

        if (data.message) {
            message.innerHTML = data.message;
        } else {
            message.innerHTML = "Something went wrong with the login request.";
        }

        console.log("Login error: " + data);
    };

    return (
        <section className='login-page-wrapper'>
            <div className='login-page'>
                <header>
                    <h1>Login Page</h1>
                </header>
            </div>
            <p className='message'></p>
            <div className='form-holder'>
                <form action="#" className='login' onSubmit={loginHandle}>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' required />
                    <br />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='Password' id='password' required />
                    <br />
                    <input type="checkbox" id='remember' name='Remember' />
                    <label htmlFor="remember">Remember password?</label>
                    <br />
                    <input type="submit" value="Login" className='login-btn' />
                </form>
            </div>
        </section>
    );
}

export default Login;
