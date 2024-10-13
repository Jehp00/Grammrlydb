import { useEffect, useState } from 'react';

function Admin() {
    document.title = "Admin Dashboard";

    const [partners, setPartners] = useState([]);


    useEffect(() => {
        fetch("api/SecureWeb/admin", {
            method: "GET",
            credentials: "include"
        }).then(res => res.json()).then(data => {
            setPartners(data.trustedPartners)
            console.log(data.trustedPartners)
        }).catch(err => {
            console.log("error while getting the user admins: " + err)
        })
    } ,[])

    return (
        <section className='admin-partner'>
            <header>
                <h1>Admin page</h1>
            </header>
            <section>
                {
                    partners ? 
                        <div>

                            <div>
                                Our trusted partners are:
                            </div>
                            <ol>
                                {partners.map((partner, idx) => 
                                    <li key={idx}>{partner}</li>
                                )}
                            </ol>
                        </div> :
                        <div className="waitibg-page">
                            <div>
                                Waiting...
                            </div>
                        </div>
                }
            </section>
        </section>
    )
}

export default Admin;