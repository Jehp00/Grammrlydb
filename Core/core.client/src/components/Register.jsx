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
        <section className='register-page-wrapper'>
            <div className='register-page'>
                <header>
                    <h1>Register Page</h1>
                </header>
            </div>
            <p className='message'></p>
            <div className='form-holder'>
                <form action="#" className='register' onSubmit={registerHandle}>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name='Name' id='name' required />
                    <br />
                    <label htmlFor="surname">Apellido</label>
                    <input type="text" name='SurName' id='surname' required />
                    <br />
                    <label htmlFor="email">Correo Electronico</label>
                    <input type="email" name='Email' id='email' required />
                    <br />
                    <label htmlFor="level">Nivel de ingles</label>
                    <select name="Level" id="level" required>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                    </select>
                    <br />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='PasswordHash' id='password' required />
                    <br />
                    <input type="submit" value="register" className='register-btn' />
                </form>
            </div>
        </section>
    );
}

export default Register;
