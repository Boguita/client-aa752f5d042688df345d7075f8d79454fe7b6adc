import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from '../assets/img/logo.png'
import Avatar from "./Avatar";
import NavBG from '../assets/img/navbg.jpg'
import {MdClose} from 'react-icons/md'
import {AiFillHome} from 'react-icons/ai'
import {BsFillFileEarmarkBarGraphFill, BsFillPeopleFill} from 'react-icons/bs'
import {BiSupport} from 'react-icons/bi'
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();   
  const location = useLocation();
  const [fix, setFix] = useState(false)

  const handleClick = () => {
  // Verificar si la ruta actual es "/home"
  if (location.pathname === '/home') {
    // Recargar la página si la ruta es "/home"
    window.location.reload();
  }
};


  // const onScroll = () => {
  //     if(window.scrollY >= 100) {
  //     setFix(true)
  //     } else {
  //        setFix(false)
  //     }
  // }
  // console.log(fix)
  // console.log(location.pathname)
  // window.addEventListener("scroll", onScroll)

  const handleLogout = () => {
      logout();
      navigate("/login");
   }

  return (
    <>
    {/* Barra horizontal superior */}
      <div className={`fixed top-0 left-0 w-full z-40  px-4 py-2 bg-[#23A1D8] text-white ${fix ? 'shadow-md' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/homeInfo">
            <img src={Logo} className="h-12  mr-2" alt="Logo" />
            </Link>
            {/* <span className="text-lg font-semibold">Nombre de la Aplicación</span> */}
          </div>
          {currentUser && (
            <div className="flex  items-center">
              <span className="mr-2 ">{currentUser.name}</span>
              <Avatar />
            </div>
          )}
        </div>
      </div>

<button
  onClick={() => setFix(!fix)} // Alternar el estado 'fix' al hacer clic
  aria-controls="logo-sidebar"
  type="button"
  class="fixed top-0 right-0 z-50  p-4 mt-2 ml-3  rounded-lg md:hidden  focus:outline-none  text-white  "
>
  <span className="sr-only">Toggle sidebar</span>
  <svg
    className="w-10 h-10"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Usar un icono de hamburguesa para abrir/cerrar */}
    {fix ? (
      <MdClose className="w-10 h-10 text-white" />
    ) : (
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 6h12a1 1 0 100-2H4a1 1 0 100 2zM4 10h12a1 1 0 100-2H4a1 1 0 100 2zM4 14h12a1 1 0 100-2H4a1 1 0 100 2z"
      />
    )}
  </svg>
</button>

<aside
  id="logo-sidebar"
  className={`fixed justify-center z-40 left-0 top-0 w-30 sm:w-72 h-screen transition-transform ${
    fix ? 'translate-x-0' : '-translate-x-full' // Usar translate para mostrar/ocultar el navbar
  } md:translate-x-0 bg-cover bg-center bg-[51rem]`}
  style={{ backgroundImage: `url(${NavBG})` }}
  aria-label="Sidebar"
>
     <div className="flex flex-col space-y-2 h-screen px-3 py-4 overflow-y-auto relative  bg-[#0d4668] bg-opacity-80"
    >
      
      <div className="h-full w-full ">
       <Link to="/homeInfo" className={`flex items-center p-2 rounded-lg dark:text-white   ${
              location.pathname === '/dashboard' ? 'text-blue-500' : 'text-gray-700'
            }`}>
          <img src={Logo} className="h-full mt-6 mb-6 mr-3 sm:h-full w-full" alt="UATRE Logo" />
       </Link>
        <ul className="flex flex-col space-y-5 font-medium justify-between">

           <li>
              <Link to="/home" onClick={handleClick}  className={`flex items-center text-center transition duration-75 justify-center p-2 hover:bg-white text-white hover:text-[#006084] bg-[#006084]  rounded-lg `}>
                   <span className="flex-shrink-0 text-lg">
                  Comenzar
                  </span>
              </Link>
          </li>

            <li>
              <p  className={`flex items-center p-2 text-gray-900 ${/^\/homeInfo(\/\w+)?$/.test(location.pathname)  ? 'text-blue-500 bg-gray-700' : 'text-white'} rounded-lg `}>
                   <span className="flex-shrink-0 text-white text-2xl transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  1°
                  </span>
                  <span className={`ml-3 ${/^\/homeInfo(\/\w+)?$/.test(location.pathname)  ? 'text-blue-500' : 'text-white'}`}>Paso</span>
              </p>
          </li>

             <li>
               <p  className={`flex items-center p-2 text-gray-900 ${/^\/home(\/\w+)?$/.test(location.pathname) || location.pathname === '/registro-afiliado'  ? 'text-blue-500 bg-gray-700' : 'text-white'} rounded-lg  `}>
                    <span className="flex-shrink-0 text-white text-2xl transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  2°
                  </span>
                   <span className={`ml-3 ${/^\/home(\/\w+)?$/.test(location.pathname) || location.pathname === '/registro-afiliado' ? 'text-blue-500' : 'text-white'}`}>Paso</span>
                  {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Gold</span> */}
               </p>
            </li>

          <li>
               <p  className={`flex items-center p-2 text-gray-900 ${location.pathname === '/beneficios' ? 'text-blue-500 bg-gray-700' : 'text-white'} rounded-lg  `}>
                    <span className="flex-shrink-0 text-white text-2xl transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  3°
                  </span>
                   <span className={`ml-3 ${location.pathname === '/beneficios' | '/home' ? 'text-blue-500' : 'text-white'}`}>Paso</span>
                  {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Gold</span> */}
               </p>
            </li>

           <li>
               <p className={`flex items-center p-2 text-gray-900 ${location.pathname === '/luna-de-miel' || location.pathname === '/kit-escolar' || location.pathname === '/kit-maternal' ? 'text-blue-500 bg-gray-700' : 'text-white'} rounded-lg `}>
                  <span className="flex-shrink-0 text-white text-2xl transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  4°
                  </span>
                   <span className={`ml-3 ${location.pathname === '/luna-de-miel' || location.pathname === '/kit-escolar' || location.pathname === '/kit-maternal' ? 'text-blue-500 ' : 'text-white'}`}>Paso</span>
                  {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Gold</span> */}
               </p>
            </li>
             </ul>
      </div>

        
          <ul className="flex flex-col space-y-5 font-medium mt-auto"> {/* mt-auto para separar estos elementos */}
        <li>
          <Link to="/soporte" className={`flex items-center p-2 text-gray-900 ${location.pathname === '/soporte' ? 'text-blue-500' : 'text-white'} rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`}>
            <BiSupport className="text-2xl"/>
            <span className={`ml-3 ${location.pathname === '/soporte' ? 'text-blue-500' : 'text-white'}`}>Soporte</span>
          </Link>
        </li>
        <li>
          <Link>
            <span onClick={handleLogout} className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiLogOut className="text-2xl"/>
              {(<span class="flex-1 ml-3 whitespace-nowrap">Salir</span>)}
            </span>
          </Link>
        </li>
      </ul>
    </div>
         
      

    
     
</aside>
</>

  //   <div className="navbar">
  //     <div className="container">
  //       <div className="logo">
  //         <Link to="/">
  //         <img src={Logo} alt="" />
  //         </Link>
  //       </div>
  //       <div className="links">
  //         <Link className="link" to="/?cat=web">
  //           <h6>YOUR WEBSITE</h6>
  //         </Link>
  //         <Link className="link" to="/?cat=social">
  //           <h6>SOCIAL MEDIA</h6>
  //         </Link>
  //         <Link className="link" to="/?cat=graphic">
  //           <h6>GRAPHIC DESIGN</h6>
  //         </Link>
  //         <Link className="link" to="/?cat=other">
  //           <h6>OTHER</h6>
  //         </Link>
  //         <span>{currentUser?.username}</span>
  //         {currentUser ? (
  //           <span onClick={logout}>Logout</span>
  //         ) : (
  //           <Link className="link" to="/login">
  //             Login
  //           </Link>
  //         )}
  //         <span className="write">
  //           <Link className="link" to="/request">
  //             Write
  //           </Link>
  //         </span>
  //       </div>
  //     </div>
  //   </div>
   );
};

export default Navbar;
