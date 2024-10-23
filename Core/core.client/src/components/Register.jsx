import { useEffect } from 'react';

function Register() {
    document.title = "Pagina de registro";

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (user) {
            document.location.href = "/";
        }
    }, []);

    const registerHandle = async (e) => {
        e.preventDefault();
        const form_ = e.target;

        const formData = new FormData(form_), dataToSend = {};

        for (const [key, value] of formData.entries()) {
            dataToSend[key] = value;
        }

        if (dataToSend.Remember === "on") {
            dataToSend.Remember = true;
        }

        // Create User
        const newUserName = dataToSend.Name.trim().split("");
        dataToSend.UserName = newUserName.join("");

        const res = await fetch("api/SecureWeb/register", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(dataToSend),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("user", dataToSend.Email)
            document.location.href = "/login";
        }

        const message = document.querySelector(".message");

        if (data.message) {
            message.innerHTML = data.message;
        } else {
            message.innerHTML = "Something went wrong with the login request.";
        }

        console.log("register error: " + data);
    };

    return (
        <section className='bg-[url("/Register/wallpaperflare.com_wallpaper.jpg")] h-screen w-full place-content-center'>
            <div className='bg-white mx-auto p-16 w-[30%] rounded-[18px] border border-black'>
                <div className='register-page'>
                    <header>
                    <h1 className='text-center text-[28px]'>GrammarlyDB</h1>
                    <h1 className='text-center text-[20px]'>Datos de registro</h1>
                    </header>
                </div>
                <p className='message'></p>
                <div className='mt-10'>
                    <form action="#" className='space-y-4' onSubmit={registerHandle}>
                        <label htmlFor="name">ingrese su nombre</label><br />
                        <input className='border border-black rounded-[5px] px-4 py-2 w-[70%]' type="text" name='Name' id='name' required />
                        <br />
                        <br />
                        <label htmlFor="surname">ingrese su apellido</label><br />
                        <input className='border border-black rounded-[5px] px-4 py-2 w-[70%]' type="text" name='SurName' id='surname' required />
                        <br />
                        <br />
                        <label htmlFor="email">Ingrese su email</label><br />
                        <input className='border border-black rounded-[5px] px-4 py-2 w-[70%]' type="email" name='Email' id='email' required />
                        <br />
                        <br />
                        <label className='mr-6' htmlFor="level">Nivel de ingles:</label>
                        <select className='border border-black rounded-[5px] px-2 py-2' name="Level" id="level" required>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                        </select>
                        <br />
                        <br />
                        <label htmlFor="password">Ingrese su conntraseña</label><br />
                        <input className='border border-black rounded-[5px] px-4 py-2 w-[70%]' type="password" name='PasswordHash' id='password' required />
                        <br />
                        <input type="submit" value="enviar" className='border border-black px-4 py-2 rounded-full' />
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Register;
