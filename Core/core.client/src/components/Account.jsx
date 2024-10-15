import { useEffect, useState } from 'react';

function Account() {
    document.title = "Welcome to Grammarly";
    const [userInfo, setUserInfo] = useState({});


    useEffect(() => {
        const user = localStorage.getItem("user");
        fetch("api/SecureWeb/account/" + user, {
            method: "GET",
            credentials: "include"
        }).then(res => res.json()).then(data => {
            setUserInfo(data)
        }).catch(err => {
            console.log("error while getting the user info: " + err)
        })
    } ,[]);


    return (
        <section className='bg-[url("/Account/bg.webp")] bg-cover h-screen place-content-center'>
            <header>
                <h1 className='text-center text-[50px]'>Cuenta</h1>
            </header>
            {
                userInfo ? 
                    <div className='bg-white border border-black rounded-[18px] w-[30%] h-[60%] p-12 flex flex-col justify-center mx-auto'>
                        <img src="/Account/usa.avif" alt="usa" className='h-[500px] w-[500px]'/>
                        <span>Nombre: {userInfo.name} {userInfo.surName}</span>
                        <span>Correo electronico: {userInfo.email}</span>
                        <span>Nivel de Ingles: {userInfo.level}</span>
                    </div> :
                    <div className='warning'>
                        Access Denied!!
                    </div>

            }
        </section>
    )
}

export default Account;