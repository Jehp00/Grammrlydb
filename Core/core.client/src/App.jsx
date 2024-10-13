import './App.css';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom"
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './components/Home';
import Admin from './components/Admin';
import Login from './components/Login';
import Register from './components/Register';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route element={<ProtectedRoutes/>}>
                <Route path='/' element={<Home/>}/>
                <Route path='/Admin' element={<Admin/>}/>
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
                {
                    isLogged ?
                    <span className='item-holder'>
                        <a href="/">Home</a>
                        <a href="/Admin">Admin</a>
                        <span>Cerrar sesion</span>
                    </span> :
                    <span className='item-holder'>
                        <a href="/login">Inicia Sesion</a>
                        <a href="/register">Registrate</a>
                    </span>
                }
            </div>
            <RouterProvider router={router}></RouterProvider>
        </section>
    )
}

export default App;