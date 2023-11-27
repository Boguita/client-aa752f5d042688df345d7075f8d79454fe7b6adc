
import { useState,  useEffect } from "react";
import api from '../common/Axiosconfig'
import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from '../assets/img/logo.png'

import '../css/auth.css';


const ForgotPassword = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const id = new URLSearchParams(location.search).get("id");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    token: "",
    password: "",
    repeat_password: "",
  });
  const [inputs, setInputs] = useState({
    email: "",
  })
  const [error, setError] = useState(null);
  


  const navigate = useNavigate();

  const { login } = useContext(AuthContext);


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", inputs)   
      res.status === 200 ? setSuccess(true) : setSuccess(false)    
      // navigate("/homeInfo");
    } catch (err) {
      console.log(err)
      setError(err.response.data);
    }
    
  };

  useEffect(() => {
    if (token && id) {
      setFormData((prev) => ({ ...prev, token, id }));
      
    }
    console.log(formData)
  }, [token, id, formData]);
  return (
    <div className="form-bg ">
        
      
    <div className="container-login flex">
      
          <div className="flex items-center flex-col w-full  md:w-[50%] xl:w-[50%] 2xl:w-[50%] lg:w-[50%] h-full">
             <div className="absolute justify-start p-8">
  <a href="/login">
    <img className="flex h-20 w-auto cursor-pointer" src={Logo} alt="Logo" />
  </a>
</div>

           
          <div className="flex flex-col justify-center h-full items-center">
            <h2 className="text-white font-bold text-xl sm:text-lg md:text-xl lg:text-xl xl:text-2xl ">Ingreso al Portal de Administradores</h2>      
            <h2 className="text-white font-bold text-5xl md:text-5xl lg:text-6xl xl:text-8xl sm:text-7xl">BIENVENIDO</h2>
            <p className="w-[50%] text-center py-2 text-gray-100 font-semibold text-l">Copyright © 2023 UATRE </p>
            </div>
          </div>
     

        <div className="row flex flex-col w-[50%] h-full justify-center items-center">         
             
              

                <div className="form-container h-[12rem]">

                  <div className="flex flex-col items-center p-8 ">
                     <h3 className="title font-extrabold text-4xl text-[#006084]">Recuperar Contraseña</h3>
                  </div>
                 
                    <form className="form-horizontal">
                        <div className="form-group relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#006084]"></div>
                            <input 
                                required
                                type="text"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                        </div>
                        {/* <div className="form-group relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#006084]"></div>
                            <input 
                                
                                required
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                            
                        </div> */}
                        

                        <div className="flex flex-col justify-center items-center align-middle">
                          
                          <button disabled={success} className={`btn ${success ? "cursor-not-allowed opacity-80" : ""} `} onClick={handleSubmit}><span>RECUPERAR CONTRASEÑA</span></button>
                        </div>

                        {success && <p className="flex justify-center font-bold text-green-500 mt-2 ">Se ha enviado un correo a tu cuenta de email, revisa tu correo no deseado en caso de no recibirlo.</p>}                        
                        {error && <p className="flex justify-center text-red-500 mt-2 ">{error}</p>}
                          {/* <span className="forgot-password">
                             <Link className="hi" to="/recuperar-contraseña">He olvidado mi contraseña</Link>
                          </span>
                          <span className="">
                             <Link className="flex justify-center text-[#787779] mt-2" to="/register">¿Todavia no tienes una cuenta?<strong className="text-[#006084] font-bold ml-1 text-[15px]"> Regístrate.</strong></Link>
                          </span> */}
                    </form>
                </div>
            </div>
        
    </div>
</div>
  );
};

export default ForgotPassword;
