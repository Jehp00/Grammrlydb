import './App.css';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom"
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './components/Home';
// import Admin from './components/Admin';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Contact from './components/Contact';
import Challenges from './components/Challenges';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route element={<ProtectedRoutes/>}>
                <Route path='/' element={<Home/>}/>
                {/* <Route path='/Admin' element={<Admin/>}/> */}
                <Route path='/Cuentas' element={<Account/>}/>
                <Route path='/Contactos' element={<Contact/>}/>
                <Route path='/Retos' element={<Challenges/>}/>
            </Route>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='*' element={
                <div>
                    <header>
                        <h1>Pagina no encontrada</h1>
                    </header>
                    <p>
                        <a href="/">regresa a la pagina principal</a>
                    </p>
                </div>
            }/>
        </Route>
    )
)

function App() {
    const isLogged = localStorage.getItem("user")

    return (
        <section>
    <div className="top-nav">
        {isLogged ? (
            <div className='item-holder absolute z-50 bg-white text-black font-["fantasy"] w-full'>
                <div className='ml-[30%]'>
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/">Guias</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Contactos">Contactos</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Retos">Retos</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Cuentas">Cuenta</a>{" "}
                    <button
                        className='border border-black rounded-full hover:text-gray-200 px-4 py-2'
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload(); // reloads the page
                        }}
                        >
                        Cerrar sesion
                    </button>{" "}
                </div>
            </div>
        ) : (
            <div className='item-holder absolute z-50 bg-white text-black font-["fantasy"] w-full'>
                <div className='ml-[35%]'>
                    <a className='mr-[200px] border border-black rounded-full hover:text-gray-200 px-4 py-1' href="/login">Inicia Sesion</a>
                    <a className='border border-black rounded-full hover:text-gray-200 px-4 py-1' href="/register">Registrate</a>
                </div>
            </div>
        )}
    </div>
    <RouterProvider router={router}></RouterProvider>
</section>

    )
}

export default App;