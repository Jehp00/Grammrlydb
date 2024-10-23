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
        <section className='bg-[url("/Login/wallpaperbetter.jpg")] bg-cover h-screen w-full overflow-y-hidden place-content-center'>
            <div className='bg-white p-14 rounded-[18px] border border-black w-[20%] mx-auto'>
                <div className='login-page'>
                    <header>
                        <h1 className='text-center text-[28px]'>GrammarlyDB</h1>
                        <h1 className='text-center text-[20px]'>Iniciar Sesion</h1>
                    </header>
                </div>
                <p className='message'></p>
                <div className='form-holder'>
                    <form action="#" className='space-y-3' onSubmit={loginHandle}>
                        <label className='' htmlFor="email">Ingrese su email</label>
                        <input className='border border-black rounded-[5px] px-4 py-2 w-full' type="email" name='email' id='email' required />
                        <br />
                        <br />
                        <label htmlFor="">Ingrese su conntraseña</label>
                        <input className='border border-black rounded-[5px] px-4 py-2 w-full' type="password" name='Password' id='password' required />
                        <br />
                        <input type="checkbox" id='remember' name='Remember' />
                        <label className='ml-3' htmlFor="remember">Recordar conntraseña?</label>
                        <br />
                        <input type="submit" value="Enviar" className='px-4 py-2 border border-black rounded-full' />
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
