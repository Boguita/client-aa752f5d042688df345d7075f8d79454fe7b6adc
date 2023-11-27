
import { useState,  useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from '../assets/img/logo.png'
import { useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

import '../css/auth.css';
import Loader from "../components/Loader";
import Input from "../components/Input";


const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);
    const yourRef = useRef(null);

    useEffect(() => {
    yourRef.current && autoAnimate(yourRef.current)
  }, [yourRef])
  


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);      
      await login(inputs)   
      setIsLoading(false);   
      navigate("/homeInfo");
    } catch (err) {
      console.log(err)
      setError(err);
      setIsLoading(false); 
    }
    
  };
  return (
    <div className="form-bg">
        
      
    <div className="container-login flex">
      
          <div className="flex items-center flex-col w-full sm:w-full  md:w-[50%] xl:w-[50%] 2xl:w-[50%] lg:w-[50%] h-full">
             <div className="absolute justify-start p-8">
  <a href="/login">
    <img className="flex  h-14 2xl:h-20 xl:h-20 w-auto cursor-pointer" src={Logo} alt="Logo" />
  </a>
</div>


           
            <div className="flex flex-col justify-center h-full items-center">
            <h2 className="text-white font-bold text-xl sm:text-lg md:text-xl lg:text-xl xl:text-2xl ">Ingreso al Portal de Administradores</h2>      
            <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl xl:text-8xl sm:text-7xl">BIENVENIDO</h2>
            <p className="w-[50%] text-center py-2 text-gray-100 font-semibold text-l">Copyright © 2023 UATRE </p>
            </div>
          </div>
     

        <div className="row flex flex-col w-full sm:w-full  md:w-[50%] xl:w-[50%] 2xl:w-[50%] lg:w-[50%] h-full justify-center items-center">         
             
              

                <div className="form-container h-[8rem]">

                  <div className="flex flex-col items-center p-8 ">
                     <h3 className="title font-extrabold text-3xl md:text-5xl lg:text-6xl xl:text-5xl sm:text-7xl text-[#006084]">Ingresar</h3>
                  </div>
                 
                    <form ref={yourRef} className="form-horizontal">
                        <div className="form-group ">
                            <div className=""></div>
                            <input 
                                required
                                type="text"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8]  border-l-4 border-[#006084] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                        </div>
                        <div className="form-group ">
                            <div className=""></div>
                            <input 
                                
                                required
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8]  border-l-4 border-[#006084] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                            
                        </div>
                        

                        <div ref={yourRef} className="flex flex-col justify-center items-center align-middle">
                          
                          {isLoading ? <Loader/> :
                          <button className="btn" onClick={handleSubmit}><span>INICIAR SESIÓN</span></button>}
                        </div>
                        
                        {error && <p className="flex justify-center font-bold text-red-500 mt-2 ">{error}</p>}
                          <span className="forgot-password">
                             <Link className="hi" to="/forgot-password">He olvidado mi contraseña</Link>
                          </span>
                          <span className="flex ">
                             <Link className="flex justify-center text-[#787779] " to="/register">¿Todavia no tienes una cuenta?<strong className="text-[#006084] font-bold ml-1 text-[15px]"> Regístrate.</strong></Link>
                          </span>
                    </form>
                </div>
            </div>
        
    </div>
</div>
  );
};

export default Login;
