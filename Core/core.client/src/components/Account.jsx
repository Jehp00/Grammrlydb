import { useEffect, useState } from 'react';

function Account() {
    document.title = "Welcome to Grammarly";

    const [userInfo, setUserInfo] = useState({});


    useEffect(() => {
        const user = localStorage.getItem("user");
        fetch("api/SecureWeb/account" + user, {
            method: "GET",
            credentials: "include"
        }).then(res => res.json()).then(data => {
            setUserInfo(data.userInfo)
        }).catch(err => {
            console.log("error while getting the user info: " + err)
        })
    } ,[])

    return (
        <section>
            <header>
                <h1>Welcome to the english paradise bitches</h1>
            </header>
            {
                userInfo ? 
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Level</th>
                                    <th>Created at</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{userInfo.Name}</td>
                                    <td>{userInfo.Email}</td>
                                    <td>{userInfo.Level}</td>
                                    <td>{userInfo.CreatedDate ? userInfo.CreatedDate.split(":")[0] : ""}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> :
                    <div className='warning'>
                        Access Denied!!!!! You son of a bitch
                    </div>

            }
        </section>
    )
}

export default Account;