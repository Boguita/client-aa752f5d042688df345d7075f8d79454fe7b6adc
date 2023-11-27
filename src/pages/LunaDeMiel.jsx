import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import {BiError} from "react-icons/bi"
import api from "../common/Axiosconfig";

import { useAutoAnimate } from '@formkit/auto-animate/react';
import {FiDownload} from 'react-icons/fi'
import Files from "../components/Files";
import Avion from '../assets/img/plane.png';
import Input from "../components/Input";
import Loader from "../components/Loader";

const LunaDeMiel = () => {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dni, setDni] = useState("");
  const [useConyugue, useSetConyugue] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
const [beneficio, setBeneficio] = useState({

  "0": {  
        usuario_otorgante: currentUser?.username,
        id: "",
        tipo: "Luna de miel",
        numero_libreta: "",
        afiliado_id: "",
        familiar_id: null,    
        detalles: "",
        estado: "Pendiente",
        
  }
});

const [error, setError] = useState(null);

const [animationParent] = useAutoAnimate();

 
  const [familiares, setFamiliares] = useState({
    name: "",
    dni: "",
    fecha_de_nacimiento: "",
    tel: "",
    categoria: "Conyugue",
    numero_libreta: "",
    id_afiliado: "",
 } );



const handleNextStep = async () => {
  
  setError(null); // Limpiar cualquier error previo
  setCurrentStep(currentStep + 1);
};


    const handleBackStep = async () => {
    setCurrentStep(currentStep - 1);

  
  };

   useEffect(() => {
    // Obtener el dni de location.state y almacenarlo en el estado local al cargar el componente
    setDni(location.state?.dni);
  }, []);


 const handleInputChange = async (e, tipo) => {
    const { name, value, type } = e.target;

    if  (tipo === 'familiar') {
    setFamiliares(prevFamiliares => ({
      ...prevFamiliares,
      
      [name]: value,
      
    }));
  } else {
    setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        [name]: value,
      },
    }));
    if(name === 'numero_libreta') {
    setFamiliares (prevFamiliares => ({
      ...prevFamiliares,
      [name]: value,
    }));
  }
  }
    
  };




useEffect(() => {
  const familia = familiares;
  console.log('Estado de beneficios actualizado:', beneficio[0].familiar_id); 
  console.log('Estado de familiares actualizado:', familiares);
}, [familiares, beneficio, selectedFiles]);


const handleLibretaChange = (e) => {
    const filesArray = Array.from(e.target.files);
    
    setSelectedFiles(filesArray);
  };

const handleRegisterAfiliate = async (e) => {
  
  try {
  setError(null)
   const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }
    const hasFamiliar = beneficio[0].familiar_id !== undefined && beneficio[0].familiar_id !== null && beneficio[0].familiar_id !== "";
    if (!hasFamiliar) {
      // Si no existe un familiar registrado, registrar uno automáticamente
      const res = await api.post("/users/registro-familiar", familiares);
      const nuevoFamiliarId = res.data.familiar_id;
      console.log("entro")
      if (res.status !== 200) {
        // Manejar el error o mostrar un mensaje al usuario
        setError("Error al registrar el familiar", res.data.error);
        return;
      }
      
      // Actualizar el estado de beneficio con la ID del familiar registrado
      const updatedBeneficio = {
          ...beneficio,
          [0]: {
            ...beneficio[0],
            familiar_id: nuevoFamiliarId,
          },
        };

        setBeneficio(updatedBeneficio);
    console.log(updatedBeneficio);

       
    const res2 = await api.post("/tasks/", updatedBeneficio)
    const nuevoBeneficioIds = res2.data.ids;
    console.log(nuevoBeneficioIds);
    // Actualizar el estado "beneficio" con la ID para cada familiar otorgado
   const updatedBeneficios = {
        ...beneficio,
        [0]: {
          ...beneficio[0],
          id: nuevoBeneficioIds[0],
        },
      };

      setBeneficio(updatedBeneficios);

    
    
   const res3 = await handleImageUpload();
   if(res3.status === 200) {
    handleNextStep();
    }
    return res2;
      // Continuar con el proceso de otorgar el beneficio
      
    } else {
      console.log("no entro")
    await handleBeneficioOtorgado(e);
    }
  } catch (err) {
    setError(err.response.data.error);
  }
};

  const handleImageUpload = async (idPass) => {
     if (selectedFiles.length === 0) {
      setError("No se pudieron subir los archivos.");
      return;
    }
    try {    
      // Upload Libreta images
      // const libretaFormData = new FormData();
      // libretaFormData .append("id", beneficio.familiar_id);
      // familiares.libreta.forEach((libretaImg) => {
      //   libretaFormData .append("libreta", libretaImg);
      // });
      // // await Promise.all(formData.dni_img.map(loadImage));
      // const responseLibreta = await api.post("/uploads/images-libreta", libretaFormData );

        const libretaFormData = new FormData();
      
      selectedFiles.forEach((libretaImg) => {
        libretaFormData.append("dni", familiares.dni ? familiares.dni : idPass);
        libretaFormData.append("libreta", libretaImg);
        
      });
      // await Promise.all(formData.dni_img.map(loadImage));
      const responseCertificado = await api.post("/uploads/images-libreta", libretaFormData);
   

      return responseCertificado;
    

      // Aquí puedes mostrar un mensaje de éxito o realizar acciones adicionales después de la carga de imágenes
    } catch (err) {
      console.error(err);
      // Aquí puedes mostrar un mensaje de error o realizar acciones adicionales en caso de error
    } // finally {
    //   // Revocar las URLs de los objetos Blob para liberar memoria
    //   formData.dni_img.forEach((dniImg) => URL.revokeObjectURL(dniImg.src));
    //   formData.recibo_sueldo.forEach((reciboSueldo) =>
    //     URL.revokeObjectURL(reciboSueldo.src)
    //   );
    // }
  };


   const handleAfiliadoSearch = async (dni) => {
  try {
    const res = await api.get(`users/afiliados/${dni}`);
    const familiaresDisponibles = res.data.familiares;
    const afiliado = res.data;
    

    if (familiaresDisponibles === null) {
      
      setFamiliares(prevFamiliares => ({
      ...prevFamiliares,
      
        
      id_afiliado: afiliado.idafiliados,
    
    }));
          setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        afiliado_id: afiliado.idafiliados,
      },
    }));
      setIsLoading(false);
      return;
    }

    const familiaresConyugue = familiaresDisponibles.filter(
      (familiar) => familiar.categoria === 'Conyugue'
    );

    if (familiaresConyugue.length === 0) {
      
       setFamiliares(prevFamiliares => ({
      ...prevFamiliares,
      
    
      id_afiliado: afiliado.idafiliados,
   
    }));
          setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        afiliado_id: afiliado.idafiliados,
      },
    }));
      
      setIsLoading(false);
      return;
    }

 
    
    // setBeneficio(prevBeneficio => ({
    //   ...prevBeneficio,
    //   [name]: value,
    // }));
    setFamiliares(familiaresConyugue);
     setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        afiliado_id: afiliado.idafiliados,
        familiar_id: familiaresConyugue[0].id,
      },
    }));
    setIsLoading(false);
    
  
    
  } catch (err) {
    console.log(err);
  }
};

// ...

// useEffect(() => {
//   const errors = validateFields(); // Realizar la validación
//   setValidationErrors(errors); // Actualizar los errores de validación
// }, [familiares, beneficio, selectedFiles]); // Ejecutar el efecto cuando estos estados cambien

// // ...


const validateFields = () => {
  if(useConyugue) return true;
  setValidationErrors({}); // Limpiar cualquier error de validación previo
  const requiredFields = {
    familiares: ['name', 'dni', 'fecha_de_nacimiento', 'tel'],
    beneficio: ['numero_libreta'],
    selectedFiles: ['libreta'],
  };

  const errors = {};

  Object.entries(requiredFields).forEach(([fieldGroup, fieldNames]) => {
    fieldNames.forEach(fieldName => {
      if (familiares[fieldName] === "" && fieldGroup === 'familiares') {
        errors[fieldName] = "Campo requerido";
        
      }
      if (!beneficio[0][fieldName] && fieldGroup === 'beneficio') {
        
        errors[fieldName] = "Campo requerido";
      }

    });

  });
  console.log(selectedFiles)
        if (selectedFiles.length === 0) {
      
      errors.libreta = "Campo requerido";
}

  return errors;
};


  
  const handleBeneficioOtorgado = async (e) => {
  e.preventDefault();

  try {
    setError(null); // Limpiar cualquier error previo
    setIsLoading(true);
    

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }
    console.log("llega esto",beneficio)
    const res = await api.post("/tasks/", beneficio);
    
    const nuevoBeneficioIds = res.data.ids;
    console.log(nuevoBeneficioIds);
    // Actualizar el estado "beneficio" con la ID para cada familiar otorgado
    const updatedBeneficio = { ...beneficio };
    
      updatedBeneficio[0].id = nuevoBeneficioIds[0];
    
    console.log(updatedBeneficio);

    setBeneficio(updatedBeneficio);
    // // handleNextStep();

    // console.log(beneficio);

    handleImageUpload();
    setIsLoading(false);
    handleNextStep();
    // Continuar con el proceso de otorgar el beneficio
    return res

  } catch (err) {
    console.log(err.response)
    setError(err.response.data.error);

  }
  setIsLoading(false);
};

//    const comprobarBeneficios = async (familiarIds) => {
//   try {
//     const queryParams = familiarIds.join(','); // Convertir a cadena separada por comas
//     const res = await api.get(`/tasks/verified-kit-escolar/${queryParams}`);

//     setBeneficiosOtorgados(res.data);
    
//     // setIsLoading(false);
    
//   } catch (err) {
//     console.log(err);
//   }
// };

//  const handleUseConyugue = () => {
//   useSetConyugue(true);
//   };






useEffect(() => {
  error && console.log(error);
}, [error]);

  
  useEffect(() => {
    if (dni) {
      // Si hay un DNI válido en el estado local, realizar la búsqueda del afiliado
      handleAfiliadoSearch(dni);
    }
  }, [dni]);

  

return (
  <div className="bg-gray-200 p-2 h-screen w-screen sm:pl-80 sm:ml-5">
    <div className="flex mb-10 mt-40 h-20">
      <img className=" w-8 h-8 sm:w-12 sm:h-12" src={Avion}></img>
      <div className="flex flex-col pl-4">
        <h2 className=" text-black text-xl sm:text-3xl font-extrabold">
          Solicitar Beneficio: Luna de Miel
        </h2>
        { currentStep === 1 &&
        <p className="text-xs sm:text-md p-1 sm:p-2 font-bold text-[#757678]">
          Carga los datos y los archivos correspondientes <br /> para realizar
          la solicitud.
        </p>
        }
      </div>
    </div>

    <div className="flex justify-center bg-gray-200">
      <div className="sm:w-[95%]">
        <div ref={animationParent} className="grid sm:grid-cols-2 sm:space-x-8">
          {isLoading ? (
            <Loader />
          ) : (
            currentStep === 1 && (
              <>
                <div ref={animationParent} className="rounded-lg mb-2 p-8  bg-white ">
                  <h3 className="text-black text-xl font-bold">
                    Datos del Conyugue
                  </h3>

                  {/* Display familiares checkboxes here */}
                  {/* {
                  familiares.length > 0 ? (
                    familiares.map((familiar) => (
                      <div  key={familiar.id}  className="flex justify-center">
                        <div  className="flex flex-col w-[95%] ">
                          <label className="font-semibold mt-4 ">
                            Nombre y Apellido
                          </label>

                          <div
                          
                            key={familiar.id}
                            className={`flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200  `}
                          >
                            <label
                              htmlFor={`familiar_${familiar.id}`}
                              className="capitalize font-semibold text-black p-3"
                            >
                              {familiar.name}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">DNI</label>

                          <div
                            key={familiar.id}
                            className="flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                          >
                            <label className="font-semibold text-black p-3 ">
                              {familiar.dni}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">
                            Fecha de Nacimiento
                          </label>

                          <div
                            key={familiar.id}
                            className={
                              "flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                            }
                          >
                            <label className="font-semibold text-black p-3">
                              {familiar.fecha_de_nacimiento}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">
                            Teléfono
                          </label>

                          <div
                            key={familiar.id}
                            className={`flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200 " 
              }`}
                          >
                            <label className="font-semibold text-black p-3 ">
                              {familiar.tel}
                            </label>
                          </div>

                          {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : ( */}
                    <div className="flex flex-col gap-2 px-4 w-full">
                      {/* {familiares.length > 0 &&
                      <>
                      <p className="text-red-500 font-semibold mt-3">Ya existe una conyugue registrada, ¿Deseas utilizar estos datos?</p>
                      <button onClick={() => handleUseConyugue()} className="bg-[#006084] w-1/3 font-bold text-white rounded-lg p-2 hover:bg-opacity-75">Usar datos existentes</button>
                      </>
                      } */}
                      <label className="font-semibold mt-4 ">
                        Nombre y Apellido
                      </label>
                      <Input
                        name={"name"}
                        onChange={(e) => handleInputChange(e, "familiar")}
                        value={familiares.name}
                        className={"w-full p-3"}
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 ">{validationErrors.name}</p>
                      )}
                      <label className="font-semibold mt-2 ">DNI</label>
                      <Input
                        name={"dni"}
                        onChange={(e) => handleInputChange(e, "familiar")}
                        value={familiares.dni}
                        className={"w-full p-3"}
                      />
                      {validationErrors.dni && (
                        <p className="text-red-500">{validationErrors.dni}</p>
                      )}
                      <label className="font-semibold mt-2 ">
                        Fecha de Nacimiento
                      </label>
                      <Input
                        name={"fecha_de_nacimiento"}
                        type={"date"}
                        value={familiares.fecha_de_nacimiento}
                        onChange={(e) => handleInputChange(e, "familiar")}
                        className={"w-full p-3"}
                      />
                      {validationErrors.fecha_de_nacimiento && (
                        <p className="text-red-500">
                          {validationErrors.fecha_de_nacimiento}
                        </p>
                      )}
                      <label className="font-semibold mt-2 ">Teléfono</label>
                      <Input
                        name={"tel"}
                        onChange={(e) => handleInputChange(e, "familiar")}
                        value={familiares.tel}
                        className={"w-full p-3"}
                      />
                      {validationErrors.tel && (
                        <p className="text-red-500 ">{validationErrors.tel}</p>
                      )}
                    </div>
                  {/* )} */}
                </div>

                
                
                   
                <div className="rounded-lg  p-8   bg-white ">
                  <h3 className="text-black text-2xl font-bold mb-4">
                    Libreta de Matrimonio
                  </h3>
                  {/* {!useConyugue ? (
                  <> */}
                  <label className="font-semibold">
                    Número de Libreta
                  </label>
                  <div className="mt-2 mb-2">
                    <Input
                      name={"numero_libreta"}
                      onChange={handleInputChange}
                      value={beneficio.numero_libreta}
                      className={"w-[95%] p-3"}
                      placeholder={"12345"}
                    />
                    {validationErrors.numero_libreta && (
                      <p className="text-red-500">{validationErrors.numero_libreta}</p>
                    )}
                    
                  </div>
                  {/* </>
                  ) : 
                  <>
                    <h3 className="font-bold text-green-500">Ya registrada en el sistema.</h3>
                  </>
                  } */}
{/* 
                    {!useConyugue &&      */}
                  <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] p-2">
                    <p className="font-bold">Subir foto de libreta:</p>
                    <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                      Recuerda que deben figurar los datos de ambos solicitantes para corroborar la informacion.
                    </p>

                    <label
                      htmlFor="libreta"
                      className="cursor-pointer mt-auto mb-2"
                    >
                      <FiDownload className="text-5xl text-[#23A1D8]" />
                    </label>

                    <input
                      type="file"
                      name="libreta"
                      id="libreta"
                      multiple
                      required
                      style={{ display: "none" }}
                      onChange={handleLibretaChange}
                    />

                    <p className="text-xs font-semibold text-gray-600 text-center">
                      Click aquí para cargar o{" "}
                      <strong className="text-[#006084]">
                        elegir archivos.
                      </strong>
                    </p>
                     {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                      {validationErrors.libreta && (
                      <p className="text-red-500">{validationErrors.libreta}</p>
                    )}
                  </div>
                      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
                  {/* } */}
                  <div className="flex justify-end items-end mt-20 flex-col">
                  <button
                    className="bg-[#0E6F4B] w-1/3 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                    onClick={handleRegisterAfiliate}
                  >
                    Confirmar
                  </button>
                  </div>
                </div>
                {/* <div></div>

                <div className="flex justify-end pt-6">
                  
                </div> */}
              </>
            )
          )}
          
        </div>
        {/* {currentStep === 2 && (
            <>
                           
                  <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                   <Files label="Subir foto de REMITO DE ENTREGA" instructions="Recuerde que debe estar firmada por el trabajador." id={beneficio[0].id}  />

                    <p className="font-extrabold text-3xl text-[#006084]">
                      El beneficio ha sido registrado con éxito.
                    </p>
                    <p className="font-bold text-xl text-gray-500">
                      Por favor, verifique si se cargaron los datos
                      correctamente.
                    </p>
                  </div>
                  <div className="h-full w-full items-end pb-10 justify-center flex">
                    <button
                      className="btn w-1/3"
                      onClick={() => navigate("/home")}
                    >
                      <span>VOLVER</span>
                    </button>
                  </div>
               
             
            </>
          )} */}
        {currentStep === 2 && (
            <>
              {error ? (
                <>
                  <div className="flex flex-col h-full w-full justify-center items-center space-y-4">
                    <BiError className="text-[8rem] justify-center items-center text-[#006084]" />
                    <p className="font-extrabold text-3xl align-middle justify-center items-center text-red-500">
                      Ocurrio un error durante la carga de datos, por favor verificar los datos antes de reintentar:<br></br>
                      {error}
                    </p>
                     <button
                      className="btn w-1/3"
                      onClick={() => navigate("/home")}
                    >
                      <span>FINALIZAR</span>
                    </button>
                  </div>
                  
               
                </>
              ) : (
                <>
                  <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                    <img className="w-[4rem] text-[#006084]" src={Avion} />
                    <p className="font-extrabold text-2xl sm:text-3xl text-[#0E6F4B]">
                      El beneficio ha sido registrado con éxito.
                    </p>
                    <p className="font-bold text-lg sm:text-xl text-gray-500">
                      Por favor, informe al afiliado que un representante se pondra en contacto para continuar con la gestion.
                    </p>
                  </div>
                  <div className="sm:h-full sm:w-full max-sm:mt-4 items-end sm:pb-10 justify-center flex">
                    <button
                      className="btn bg-[#0E6F4B] border-[#0E6F4B] w-1/3"
                      onClick={() => navigate("/home")}
                    >
                      <span>FINALIZAR</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
      </div>
      
    </div>
    
  </div>
);

  
};

export default LunaDeMiel;
