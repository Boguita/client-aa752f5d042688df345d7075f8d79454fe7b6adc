import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from '../assets/img/logo.png'
import Input from "../components/Input";
import BgRegister from '../assets/img/bg-register.jpg'
import api from "../common/Axiosconfig";
import {BsCheck2Circle} from 'react-icons/bs'
import Select from "react-select";

const Register = () => {
  const [inputs, setInputs] = useState({
    nombre: "",
    nacionalidad: "",
    sexo: "",
    dni: "",
    cuit: "",
    provincia: "",
    delegacion: "",
    domicilio: "",
    seccional:"",    
    tel: "",
    email: "",
    password: "",
    repeat_password: "",
     // Agregar el estado para la provincia seleccionada
  });
  const [seccionales, setSeccionales] = useState([]); // Estado para almacenar las seccionales
  const [err, setError] = useState(null);
  const [provincias, setProvincias] = useState([]); // Estado para almacenar las provincias
  const [ciudades, setCiudades] = useState([]);
  const [paises, setPaises] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
    const [selectedSeccionales, setSelectedSeccionales] = useState([]);
      const [delegaciones, setDelegaciones] = useState([]);
      const [seccionalesFiltradas, setSeccionalesFiltradas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('delegacion', delegaciones)
    console.log('seccionales', seccionales)
    console.log('seccionalesFiltradas', seccionalesFiltradas)
  }, [delegaciones, seccionales, seccionalesFiltradas])


  const handleChange = async (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs)

    if (e.target.name === "provincia") {
setInputs((prev) => ({ ...prev, delegacion: "" }));

      
      const delegacion = seccionales
      .filter((seccional) => quitarAcentos(seccional.provincia) === quitarAcentos(e.target.value))
      .reduce((uniqueDelegations, seccional) => {
        const existingDelegation = uniqueDelegations.find(
          (unique) => unique.delegacion.toLowerCase() === seccional.delegacion.toLowerCase()
        );

        if (!existingDelegation) {
          uniqueDelegations.push(seccional);
        }

        return uniqueDelegations;
      }, []);
      setDelegaciones(delegacion);
  }
  if(e.target.name === "delegacion") {
   // Filtrar las seccionales por la ciudad seleccionada
    const ciudadInput = e.target.value;
    if (seccionales && seccionales.length > 0) {
  const filteredSeccionales = seccionales.filter((seccional) => quitarAcentos(seccional.ciudad) === quitarAcentos(ciudadInput));
  setSeccionalesFiltradas(filteredSeccionales);
} else {
  setSeccionalesFiltradas([]); // Establece un array vacío si no hay seccionales
}
  setError(null);
 

  }
}

  useEffect(() => {
    axios.get("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre").then((res) => {
      setProvincias(res.data.provincias);
       // Almacenar las provincias en el estado
    });
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      const commonNames = res.data.map((country) => country.name.common);
      setPaises(commonNames);
       // Almacenar las provincias en el estado
    }
    );
  }, []);

  useEffect(() => {
    api.get("/tasks/seccionales") 
    .then((res) => {
      console.log(res.data)
      setSeccionales(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const handleValidateFields = () => {
  return new Promise((resolve) => {
    if (
      !inputs.nombre ||
      !inputs.dni ||
      !inputs.cuit ||
      !inputs.nacionalidad ||
      !inputs.sexo ||
      !inputs.provincia ||
      inputs.delegacion === "" ||
      !inputs.domicilio ||
      inputs.seccional === "" ||
      !inputs.tel ||
      !inputs.email ||
      !inputs.password ||
      !inputs.repeat_password
    ) {
      setError("Complete todos los campos");
      resolve(false); // Resuelve la promesa con false si hay error
    } else {
      setError(null); // Resuelve la promesa con true si no hay error
      resolve(true);
    }
  });
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
      const validationSuccess = await handleValidateFields();

    // Verificar si hay errores de validación antes de continuar
    if (!validationSuccess) {
      return;
    }
    
    const res = await api.post("/auth/register", inputs);
    if (res.status === 200) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
    // navigate("/login");
  } catch (err) {
    setError(err.response.data);
  }
};



  
  function quitarAcentos(texto) {
  // Convertir a minúsculas y luego quitar acentos
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


  return (
    <div className="flex flex-col  min-h-screen w-screen" style={{ backgroundImage:`url(${BgRegister})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full  h-full" style={{ backgroundImage: 'linear-gradient(rgba(235, 235, 235, 0.7), rgba(235, 235, 235, 0.7))' }}>
        <div className="p-5 bg-[#006084]">
          <div onClick={()=> {navigate("/login")}} className="logo-register cursor-pointer">
                <img className="w-1/2 2xl:w-1/6 xl:w-1/6 lg:w-1/4 md:w-1/5 sm:w-1/3 " src={Logo} alt="LOGO UATRE"></img>
              </div>

        </div>
        <div className="flex max-sm:bg-white justify-center pt-4 w-full ">
          <div className=" 2xl:w-[65%] xl:w-[65%] lg:w-[55%] md:w-[55%] sm:w-[80%] w-[80%]   h-full rounded-3xl bg-white">
            <div className="form-container ">
              { currentStep === 1 && (
                <>
              <div className="flex flex-col justify-center items-center">

              <h3 className="pb-4 mt-4 text-[#006084] text-2xl text-center lg:text-3xl xl:text-4xl 2xl:text-4xl  font-extrabold">Registro de Administrador</h3>
  
              </div>
              <form className="mt-8 xl:grid xl:grid-cols-2 xl:gap-x-8">
                <div className="">
                  <Input
                    required
                    type="text"
                    placeholder="Nombre y Apellido"
                    name="nombre"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="">
                  <Input
                    required
                    type="text"
                    placeholder="DNI"
                    name="dni"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                 <div className="">
                  <Input
                    required
                    type="text"
                    placeholder="CUIT/CUIL/CDI"
                    name="cuit"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                 
                <div className="py-3 mb-6 !border-l-4 !border-[#006084] bg-[#F0F0F0]">
                  <select
                    id="nacionalidad"
                    name="nacionalidad"
                   
                    value={inputs.nacionalidad}
                    onChange={handleChange}
                    className=" bg-[#F0F0F0] pl-3 text-sm font-semibold focus:text-[#808080] focus:outline-none w-full"
                  >
                    <option value="" disabled selected>Nacionalidad</option>
                    {paises.sort().map((pais, index) => (
                      <option key={index} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>

                 <div className="py-3 mb-6 !border-l-4 !border-[#006084] bg-[#F0F0F0]">
                  <select
                    id="sexo"
                    name="sexo"
                    required
                    value={inputs.sexo}
                    onChange={handleChange}
                    className=" bg-[#F0F0F0] pl-3 text-sm font-semibold   focus:outline-none w-full"
                  >
                    <option value="" disabled selected>Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    
                  </select>
                </div>

                {/* <div className="">
                  <Input
                    required
                    type="date"
                    placeholder="Fecha de Nacimiento"
                    name="username"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div> */}


                 

                
                
                               
                <div className="py-3 mb-6 !border-l-4 !border-[#006084] bg-[#F0F0F0]">
                  <select                                    
                    id="provincia"
                    name="provincia"
                    required
                    value={inputs.provincia}
                    onChange={handleChange}
                          className=" bg-[#F0F0F0] pl-3 text-sm font-semibold   focus:outline-none w-full"
                  >
                    <option value="" disabled selected>Provincias</option>
                  {provincias && provincias
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((provincia) => (
                        <option key={provincia.id} value={provincia.nombre}>
                         {provincia.nombre}
                        </option>
                      ))}

                  </select>
                  </div>
                    <div className="py-3 mb-6 !border-l-4 !border-[#006084] bg-[#F0F0F0]">
                   <select                                    
                    id="delegacion"
                    name="delegacion"
                    value={inputs.delegacion}
                    onChange={handleChange}
                            className=" bg-[#F0F0F0] pl-3 text-sm font-semibold   focus:outline-none w-full"
                  >
                    <option value="" selected>Delegaciones</option>
                  {delegaciones
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((provincia) => (
                        <option key={provincia.id} value={provincia.delegacion}>
                         {provincia.delegacion}
                        </option>
                      ))}

                  </select>
                  </div>
                  <div className="py-3 mb-6 !border-l-4 !border-[#006084] bg-[#F0F0F0]">
                <select
                  required
                  className="bg-[#F0F0F0] uppercase pl-3 text-sm font-semibold focus:outline-none w-full"
                  value={inputs.seccional}
                  name="seccional"
                  onChange={handleChange}
                >
                  <option value="" disabled >Seccional</option>
                  {seccionales
                    .filter(
                      (seccional) =>
                        seccional.delegacion.toLowerCase() === inputs.delegacion.toLowerCase()
                    )
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map((seccional) => (
                      <option
                        key={seccional.idseccionales}
                        value={seccional.idseccionales}
                      >
                        {`${seccional.provincia}, ${seccional.delegacion}, ${seccional.nombre}`}
                      </option>
                    ))}
                </select>

                  </div>    
                 
                     <div className="">
                  <Input
                    required
                    type="text"
                    placeholder="Domicilio"
                    name="domicilio"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                        

                <div className="">
                  <Input
                    required
                    type="text"
                    placeholder="Teléfono"
                    name="tel"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <Input
                    className="form-control"
                    required
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Input
                    className="form-control"
                    required
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    onChange={handleChange}
                  />
                </div>
                 <div className="form-group">
                  <Input
                    className="form-control"
                    required
                    type="password"
                    placeholder="Repetir Contraseña"
                    name="repeat_password"
                    onChange={handleChange}
                  />
                </div>

                
              </form>
              <div className="justify-center pb-4 items-center flex flex-col">
              <button className="btn  w-32 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:1/3" onClick={handleSubmit}><span className="!text-xs">REGISTRARME</span></button>
                {err && <p className="text-red-500 pt-1">{err}</p>}
                </div>
                </>
               )}

               {currentStep === 2 && (
                 <>
                 <div className="flex flex-col h-[40rem] justify-center items-center space-y-4">
                  <BsCheck2Circle className="text-[8rem] text-[#006084]"/>
                  <p className="font-extrabold text-3xl text-[#006084]">Gracias por registrarte.</p>
                  <p className="font-bold text-xl text-gray-500">Muy pronto confirmaremos tu usuario por mail.</p>

                  </div>
                  <div className="justify-center items-center flex">
              <button className="btn  w-1/3" onClick={() => navigate('/login')}><span>VOLVER</span></button>
                {err && <p>{err}</p>}
                </div>
                  </>
                  )
                  }
            </div>
            
          </div>
        </div>
      </div>
              
      <footer className="flex justify-center items-center bg-[#E5E5E5] w-full h-20">
        <div className="flex">
          <p className="text-[#006084] text-sm font-semibold">© 2023 UATRE - Unión Argentina de Trabajadores Rurales y Estibadores</p>
          </div>
      </footer>
    </div>
  );
};

export default Register;


//     <div className="auth">
//       <h1>Register</h1>
//       <form>
//         <input
//           required
//           type="text"
//           placeholder="username"
//           name="username"
//           onChange={handleChange}
//         />
//         <input
//           required
//           type="email"
//           placeholder="email"
//           name="email"
//           onChange={handleChange}
//         />
//         <input
//           required
//           type="password"
//           placeholder="password"
//           name="password"
//           onChange={handleChange}
//         />
//         <button onClick={handleSubmit}>Register</button>
//         {err && <p>{err}</p>}
//         <span>
//           Do you have an account? <Link to="/login">Login</Link>
//         </span>
//       </form>
//     </div>
//   );
// };
