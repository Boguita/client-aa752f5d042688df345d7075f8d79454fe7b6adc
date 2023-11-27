import { useState,  useEffect } from "react";
import api from '../common/Axiosconfig'
import { useContext } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from '../assets/img/logo.png'

import '../css/auth.css';
import Loader from "../components/Loader";


const ResetPassword = () => {
  const location = useLocation();
  // const token = new URLSearchParams(location.search).get("token");
  // const id = new URLSearchParams(location.search).get("id");
  const { id, token } = useParams();
  const [inputs, setInputs] = useState({
    password: "",
    repeat_password: "",
  });
  const [validateError, setValidateError] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  


  const navigate = useNavigate();

  const { login } = useContext(AuthContext);


  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
       const errors = validateFields();
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        setValidateError(errors);
        setLoading(false);
        return;
      }
      const res = await api.post(`/auth/reset-password/${id}/${token}`, inputs)   
      res.status === 200 ? setSuccess(true) : setError("Ocurrio un error al reestablecer la contraseña, espera unos minutos antes de volver a intentarlo")
      setLoading(false);
      // navigate("/homeInfo");
    } catch (err) {
      console.log(err)
      setError(err);
    }
    
  };

const validateFields = () => {
  setError(null); // Limpiar cualquier error de validación previo
  const requiredFields = ["password", "repeat_password"];

  const errors = {};

  if (inputs.password !== inputs.repeat_password) {
    errors.repeat_password = "Las contraseñas no coinciden.";
  }

  requiredFields.forEach((fieldName) => {
    if (inputs[fieldName] === "") {
      errors[fieldName] = "Debes completar todos los campos.";
    }
  });

  return errors;
};



  // useEffect(() => {
  //   if (token && id) {
  //     setInputs((prev) => ({ ...prev, token, id }));
      
  //   }
  //   console.log(inputs);
  // }, [token, id, inputs]);
  return (
    <div className="form-bg ">
        
      
    <div className="container-login flex">
      
          <div className="flex flex-col w-[50%] h-full">
            <div className="absolute justify-start p-8">
  <a href="/login">
    <img className="flex h-20 w-auto cursor-pointer" src={Logo} alt="Logo" />
  </a>
</div>

           
            <div className="flex flex-col justify-center h-full items-center">
            <h2 className="text-white font-bold text-2xl">Ingreso al Portal de Administradores</h2>      
            <h2 className="text-white font-bold text-8xl">BIENVENIDO</h2>
            <p className="w-[50%] text-center py-2 text-gray-100 font-semibold text-l">Copyright © 2023 UATRE </p>
            </div>
          </div>
     

        <div className="row flex flex-col w-[50%] h-full justify-center items-center">         
             
              

                <div className="form-container h-[12rem]">

                  <div className="flex flex-col items-center p-8 ">
                     <h3 className="title font-extrabold text-4xl text-[#006084]">Reestablecer Contraseña</h3>
                    
                  </div>
                 
                    <form className="form-horizontal">
                      
                        <div className="form-group relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#006084]"></div>
                            <input 
                                required
                                type="text"
                                placeholder="Contraseña"
                                name="password"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                        </div>
                        

                        <div className="form-group relative">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#006084]"></div>
                            <input 
                                required
                                type="password"
                                placeholder="Repetir contraseña"
                                name="repeat_password"
                                onChange={handleChange}
                                className='form-control p-2 bg-[#d8d8d8] font-semibold text-gray-800 w-80 mt-4 pl-6 pr-4'
                            />
                            
                        </div>
                        
                        

                     <div className="flex flex-col justify-center items-center align-middle">
  {loading ? (
    <Loader />
  ) : success ? (
    <>
     
      <button onClick={() => navigate("/login")} className="btn">
        <span>LOGIN</span>
      </button>
       <p className="flex justify-center font-bold text-green-500 mt-2">
        Se reestableció correctamente tu contraseña.
      </p>
    </>
  ) : (
    <>
      <button className="btn" onClick={handleSubmit}>
        <span>RECUPERAR CONTRASEÑA</span>
      </button>
      {(validateError.password || validateError.repeat_password) && (
        <p className="text-red-500 mt-4 font-semibold text-base">
          {validateError.password || validateError.repeat_password}
        </p>
      )}
      {error && (
        <p className="flex justify-center font-bold text-red-500 mt-2 ">
          {error}
        </p>
      )}
    </>
  )}
</div>

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

export default ResetPassword;
