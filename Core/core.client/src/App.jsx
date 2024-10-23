import './App.css';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom" // paquete de react para controloar las rutas de las paginas
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Contact from './components/Contact';
import Challenges from './components/Challenges';

// Enrutador para las paginas
// Esto funciona por un module de node 
const router = createBrowserRouter(
    // Crea una ruta dependiando del componente que le pase
    createRoutesFromElements(
        <Route path='/'>
            {/* ProtectedRoutes hace una peticiona a la base de datos y revisa si el usuario ha iniciado sesion, si no retorna la login */}
            <Route element={<ProtectedRoutes/>}>
            {/* Rutas de la pagina en donde por cada ruta se renderiza un componente */}
                <Route path='/' element={<Home/>}/>
                <Route path='/Cuentas' element={<Account/>}/>
                <Route path='/Contactos' element={<Contact/>}/>
                <Route path='/Retos' element={<Challenges/>}/>
            </Route>
            {/* Rutas de inicio de sesion y registro */}
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
    // me trae delambiente de google el email que se guarda cunado se inicia sesion
    const isLogged = localStorage.getItem("user")

    return (
        <section>
    <div className="top-nav">
        {isLogged ? (
            <div className='item-holder absolute z-50 bg-white text-black font-["fantasy"] w-full'>
                <img src="/logo.jpg" alt="" className='w-auto h-full'/>
                <div className='ml-[30%]'>
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/">Guias</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Contactos">Contactos</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Retos">Retos</a>{" "}
                    <a className='mr-8 border border-black rounded-full hover:text-gray-200 px-4 py-2' href="/Cuentas">Cuenta</a>{" "}
                    {/* El boton de cerrar sesion vacia el ambiente local del browser y refresca la pagina */}
                    <button
                        className='border border-black rounded-full hover:text-gray-200 px-4 py-2'
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload(); // refresca la pagina
                        }}
                        >
                        Cerrar sesion
                    </button>{" "}
                </div>
            </div>
        ) : (
            <div className='item-holder absolute z-50 bg-white text-black font-["fantasy"] w-full'>
                <img src="/logo.jpg" alt="" className='w-auto h-full'/>
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