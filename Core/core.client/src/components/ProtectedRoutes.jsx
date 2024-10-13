import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    const [isLogged, setIsLogged] = useState(false)
    const [waiting, setWaiting] = useState(true)

    useEffect(() => {
        fetch("api/SecureWeb/xhtlekd", {
            method: "GET",
            credentials: "include"
        }).then(res => res.json()).then(data=> {
            console.log(data.message)
            setIsLogged(true)
            setWaiting(false)
            localStorage.setItem("user", data.user.email)
            console.log(data.user)
        }).catch((err) => {
            console.log("Error protected Routes", err)
        })
    }, []);

    return waiting ? <div className="waiting-page">
                        <div>Waiting.....</div>
                    </div>
                    :
                    isLogged ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes