
import { useState,  useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from '../assets/img/logo.png'
import { useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

import '../css/auth.css';
import Loader from "../components/Loader";


const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const navigate = useNavigate();

  const { loginAdmin } = useContext(AuthContext);
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
      const res = await loginAdmin(inputs)             
      setIsLoading(false);   
      navigate("/admin/dashboard");  
    } catch (err) {
      console.log(err)
      setError(err);
      setIsLoading(false); 
    }
    
  };
  return (
    <div className="form-bg ">
        
      
    <div className="container-login-admin flex">
      
          <div className="flex pt-8 flex-col w-full h-full">
             <div className="flex items-center justify-center p-8">
                <a href="/admin/login">
                  <img className="flex max-sm:h-16 h-24 w-auto cursor-pointer" src={Logo} alt="Logo" />
                </a>
              </div>  
            
          
     

        <div className="row flex flex-col h-[50%] justify-center items-center">         
             
              

                <div className="form-container h-[12rem]">

                  <div className="flex flex-col items-center p-8">
                     <h3 className="title font-extrabold text-center text-4xl text-[#23A1D8] max-sm:text-3xl ">Ingreso de <br/> Administrador</h3>
                  </div>
                 
                    <form ref={yourRef} className="form-horizontal">
                        <div className="form-group relative">
         
                            <input 
                                required
                                type="text"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8]  border-l-4 border-[#006084] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                        </div>
                        <div className="form-group relative">

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
                             <Link className="hi text-[#23A1D8] text-lg" to="/forgot-password">He olvidado mi contraseña</Link>
                          </span>
                         
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
  );
};

export default Login;
