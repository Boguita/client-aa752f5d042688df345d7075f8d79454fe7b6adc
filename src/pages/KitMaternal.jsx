import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import {BiError} from "react-icons/bi"
import api from "../common/Axiosconfig";
import Modal from "react-modal";

import {FiDownload} from 'react-icons/fi'
import Files from "../components/Files";
import Mono from '../assets/img/mono.png';
import Input from "../components/Input";
import Loader from "../components/Loader";
import { useAutoAnimate } from '@formkit/auto-animate/react';

const KitMaternal = () => {

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [animationParent] = useAutoAnimate();
  const [dni, setDni] = useState("");
   const [useConyugue, useSetConyugue] = useState(false);
   const [mensajeEntrega, setMensajeEntrega] = useState(false);
 const [showButton, setShowButton] = useState(true);
 const [modalMadreIsOpen, setModalMadreIsOpen] = useState(false);
 const [madres, setMadres] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [beneficiosOtorgados, setBeneficiosOtorgados] = useState([]);
const [beneficio, setBeneficio] = useState({

  "0": {  
        usuario_otorgante: currentUser?.username,
        id: "",
        tipo: "Kit maternal",
        afiliado_id: "",
        familiar_id: null,
        semanas: "",
        fecha_de_parto: "",
        cantidad: "",
        detalles: currentUser?.seccional,
        seccional: currentUser?.provincia,
        estado: "Pendiente",
        
        
  }
});

const [error, setError] = useState(null);


 
  const [familiares, setFamiliares] = useState({
    
    name: "",
    dni: "",
    fecha_de_nacimiento: "",
    tel: "",
    categoria: "Madre",
    id_afiliado: "",
 } );

   const [conyugue, setConyugue] = useState({
    
    name: "",
    dni: "",
    fecha_de_nacimiento: "",
    tel: "",
    categoria: "",
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
  }
    
  };

  const handleValidateBenefit = async () => {
  try {
    const res = await api.get(`tasks/beneficio/${dni}`);
    if (!res.data) {
      // La respuesta está vacía o nula, manejar este caso apropiadamente
      console.log('No se encontraron beneficios para el DNI proporcionado.');
       setIsLoading(false);
      return;
    }

    const benefit = res.data;

    // const beneficioCantidad = benefit.filter(
    //   (beneficio) =>
    //     beneficio.tipo === 'Kit maternal' &&
    //     (beneficio.estado === 'Pendiente' || beneficio.estado === 'Enviado') &&
    //     beneficio.fecha_otorgamiento.includes(new Date().getFullYear()) 
    // );

    // setCantidad(beneficioCantidad.cantidad);

    // Filtra beneficios por tipo "Kit maternal" y estado "Aprobado" o "Entregado"
    const beneficioMaternal = benefit.filter(
      (beneficio) =>
        beneficio.tipo === 'Kit maternal' &&
        (beneficio.estado === 'Aprobado' || beneficio.estado === 'Entregado' || beneficio.estado === 'Enviado' || beneficio.estado === 'Pendiente') &&
        beneficio.fecha_otorgamiento.includes(new Date().getFullYear())
    );

    if (beneficioMaternal.length > 0) {
      setDisabled(true);
    }

    console.log(res.data);
    // Restablecer el estado del error si la solicitud tiene éxito
  } catch (error) {
    console.log(error);
    setIsLoading(false);
    // setError(error.response.data.message);
  }
};




  const beneficioPendiente = async (familiarId, categoria) => {
  try {
     // Convertir a cadena separada por comas
    const res = await api.get(`/tasks/verified-kit-maternal/${familiarId}`);
    const beneficiosOtorgados = res.data;
    const beneficioFiltrado = beneficiosOtorgados.filter(
      (beneficio) =>
        beneficio.tipo === 'Kit maternal' &&
        (beneficio.estado === 'Enviado' || beneficio.estado === 'Pendiente') &&
        beneficio.fecha_otorgamiento.includes(new Date().getFullYear())
    );
    res.status === 200 &&
     
    
     setBeneficiosOtorgados(prevBeneficiosOtorgados => ({
      ...prevBeneficiosOtorgados,
      [familiarId]: {       
 
          ...beneficioFiltrado, // Nuevos beneficios
     
      },
    }));
 
    if(beneficioFiltrado.length === 0) {
      return;
    } else {
      console.log("entro", categoria)
      if(categoria === 'Madre') {
        setMensajeEntrega(true);
        setModalMadreIsOpen(true);
      } else {
      setMensajeEntrega(true);
      setModalIsOpen(true);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

 const handleUpdateBeneficio = async (ids) => {


  try {
    setError(null); // Limpiar cualquier error previo
    setIsLoading(true);  
    const res = await api.put(`/tasks/${ids ? ids : beneficiosOtorgados[0].id}`, {estado: "Entregado"});
    res.status === 200 &&
    console.log(res.data);
    // await descontarStock(currentUser?.seccional_id);
    setIsLoading(false);
    setModalIsOpen(false);
    setModalMadreIsOpen(false);
    handleNextStep();
    return res;

  } catch (err) {
    console.log(err)
    setError( "Error al entregar el beneficio");
     setIsLoading(false);
  }
  setIsLoading(false);
  
};

// const descontarStock = async (seccional) => {
//   try {
//     const copyBenefit = {
      
//       cantidad: 0, // Aquí puedes incluir la lógica para obtener los talles correctos
//       funcion: 'restar',
//     };

//     // Itera sobre los índices (IDs de familiares) del objeto beneficio
//     Object.keys(beneficiosOtorgados).forEach((familiarId) => {
//       const { cantidad } = beneficio[familiarId];            
//       copyBenefit.cantidad = cantidad;
      
//     });

//     console.log("esto se envia a descontar", copyBenefit);
//     // Realiza la solicitud a la API con el objeto copyBenefit
//     const res = await api.put(`/tasks/stock-maternal/${seccional}`, copyBenefit);
//     const stocks = res.data;
//     console.log(stocks);
//     return stocks;
    
//   } catch (err) {
//     console.log(err);
//   }
// };

   
  



useEffect(() => {
  const familia = familiares;
  // console.log('Estado de beneficios actualizado:', beneficio[0].familiar_id); 
  // console.log('Estado de beneficio actualizado:', beneficio);
  console.log('Estado de familiares actualizado:', familiares);
  console.log(madres)
  
  console.log('Estado de beneficios otorgados actualizado:', beneficiosOtorgados);
}, [familiares, beneficio, madres,beneficiosOtorgados]);


const handleCertificadoChange = (e) => {
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
    if (!hasFamiliar ) {
      // Si no existe un familiar registrado, registrar uno automáticamente
      const res = await api.post("/users/registro-familiar", familiares);
      const nuevoFamiliarId = res.data.familiar_id;
      console.log("entro")
      // if (res.status !== 200) {
      //   // Manejar el error o mostrar un mensaje al usuario
      //   setError("Error al registrar el familiar");
      //   return;
      // }
      
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

    
    
   const res3 = await handleImageUpload(nuevoBeneficioIds[0]);
   if(res3.status === 200) {
    handleNextStep();
    }
      // Continuar con el proceso de otorgar el beneficio
      
    } else {
      console.log("no entro")
    await handleBeneficioOtorgado(e);
    }
  } catch (err) {
    console.log(err);
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

        const certificadoFormData = new FormData();
      
      selectedFiles.forEach((certificadoImg) => {
        certificadoFormData.append("id", beneficio[0].id ? beneficio[0].id : idPass);
        certificadoFormData.append("certificado", certificadoImg);
        
      });
      // await Promise.all(formData.dni_img.map(loadImage));
      const responseCertificado = await api.post("/uploads/images-certificado", certificadoFormData);
   

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
    console.log("familiares", familiaresDisponibles)

    if (familiaresDisponibles === null) {
      setError("No se encontraron datos de familiares.");
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

    
    const familiaresMadre = familiaresDisponibles.filter(
      (familiar) => familiar.categoria === 'Madre');
    if (familiaresMadre.length === 0) {
      console.log("No se encontraron familiares con categoría 'Madre'.");
    } else {
      
     familiaresMadre.forEach(async (familiar) => {
    const beneficioResult = await beneficioPendiente(familiar.id, familiar.categoria);
    
    
});
setMadres(familiaresMadre);
 
    }

      
   
    
    const familiaresConyugue = familiaresDisponibles.filter(
      (familiar) => familiar.categoria === 'Conyugue' 
    );

    if (familiaresConyugue.length === 0) {
      console.log("No se encontraron familiares con categoría 'Conyugue'.");
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
    
     await setConyugue(familiaresConyugue);    
     await setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        afiliado_id: afiliado.idafiliados,        
      },
    }));
     setFamiliares(prevFamiliares => ({
      ...prevFamiliares,
      
    
      id_afiliado: afiliado.idafiliados,
   
    }));
    
    await beneficioPendiente(familiaresConyugue[0].id);   
    await handleValidateBenefit();
    await setIsLoading(false);
    
  
    
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
  setValidationErrors({}); // Limpiar cualquier error de validación previo
  const requiredFields = {
    familiares: ['name', 'dni', 'fecha_de_nacimiento', 'tel'],
    beneficio: ['semanas', 'fecha_de_parto', 'cantidad'],
    selectedFiles: ['certificado'],
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
      
      errors.certificado = "Campo requerido";
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
    

  } catch (err) {
    console.log(err.response)
    setError(err.response.data.error? err.response.data.error : "Error al otorgar el beneficio");

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


 const handleUseConyugue = () => {
  useSetConyugue(true);
  setShowButton(false);
  setFamiliares(conyugue[0]);
  setBeneficio(prevBeneficio => ({
      ...prevBeneficio,
      0: { // Acceder al índice 0 directamente
        ...prevBeneficio[0], // Mantener los valores existentes en el índice 0
        familiar_id: conyugue[0].id,
      },
    }));
  };
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
  let day = date.getDate().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos

  // Formatea la fecha como "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
};


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
  <div className="bg-gray-200 h-screen w-screen sm:pl-80 max-sm:p-3 sm:ml-5">
    <div className="flex mb-10 mt-32 h-20">
      <img className=" w-12 h-12" src={Mono}></img>
      <div className="flex flex-col pl-4">
        <h2 className=" text-black text-2xl sm:text-3xl font-extrabold">
          Solicitar Beneficio: Kit Nacimiento
        </h2>
        { currentStep === 1 &&
        <p className="p-2 text-xs sm:text-md font-bold text-[#757678]">
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
                <div ref={animationParent} className="rounded-lg  p-8  bg-white ">
                  <h3 className="text-black text-xl sm:text-2xl font-bold">
                    Datos de la Madre
                  </h3>

                  {/* Display familiares checkboxes here */}
                  {/* { useConyugue && familiares.length > 0 ? (
                    familiares.map((familiar) => (
                      <div ref={animationParent} key={familiar.id} className="flex justify-center">
                        <div className="flex flex-col w-[95%] ">
                          <label className="font-semibold mt-4 ">
                            Nombre y Apellido
                          </label>

                          <div
                            key={familiar.id}
                            className={`flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200  `}
                          >
                            <label
                              htmlFor={`familiar_${familiar.id}`}
                              className=" capitalize font-semibold text-black p-3"
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
                            <label  className="font-semibold text-black p-3 ">
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
                     <div  ref={animationParent} className="flex flex-col gap-2 px-4 w-full">
                  {conyugue.length > 0 && showButton &&
                       <>
                      <p className="text-red-500 max-sm:text-xs text-center font-semibold mt-3">Existe una conyugue registrada, ¿Deseas utilizar estos datos?</p>
                      <div className="flex justify-around">
                          <button onClick={() => handleUseConyugue()} className="bg-[#006084] sm:w-1/3 font-bold text-white rounded-lg p-2 hover:bg-opacity-75">Usar datos existentes</button>
                          <button onClick={() => setShowButton(false)} className="bg-red-500 sm:w-1/3 font-bold text-white rounded-lg p-2 hover:bg-opacity-75">No</button>
                      </div>
                      </>
                      }   
                      
                      <label className="font-semibold mt-4 ">
                        Nombre y Apellido
                      </label>
                      <Input
                        name={"name"}
                        onChange={(e) => handleInputChange(e, "familiar")}
                        value={familiares.name}
                        className={"w-full p-3"}
                        disabled={beneficio[0].familiar_id || disabled}
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
                        disabled={beneficio[0].familiar_id || disabled}
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
                        disabled={beneficio[0].familiar_id || disabled}
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
                        disabled={beneficio[0].familiar_id || disabled}
                      />
                      {validationErrors.tel && (
                        <p className="text-red-500 ">{validationErrors.tel}</p>
                      )}
                    </div>
                  {/* )} */}
                </div>

                <div ref={animationParent} className="rounded-lg max-sm:mt-3  p-8   bg-white ">
                  <h3 className="text-black text-2xl font-bold mb-4">
                    Certificado Médico
                  </h3>
                  <label className="font-semibold">
                    Cantidad de Semanas de Gestación
                  </label>
                  <div className="mt-2 mb-2">
                    <Input
                      name={"semanas"}
                      onChange={handleInputChange}
                      value={beneficio.semana}
                      className={"w-[95%] p-3"}
                      placeholder={"12345"}
                      disabled={disabled}
                    />
                    {validationErrors.semanas && (
                      <p className="text-red-500">{validationErrors.semanas}</p>
                    )}
                  </div>
                  <label className="font-semibold">
                    Fecha posible de parto
                  </label>
                  <div className="mt-2 mb-2">
                    <Input
                      name={"fecha_de_parto"}
                      type={"date"}
                      onChange={handleInputChange}
                      value={beneficio.fecha_de_parto}
                      className={"w-[95%] p-3"}
                      placeholder={"12345"}
                      min={getCurrentDate()}
                         disabled={disabled}
                    />
                    {validationErrors.fecha_de_parto && (
                      <p className="text-red-500">
                        {validationErrors.fecha_de_parto}
                      </p>
                    )}
                  </div>
                  <label className="font-semibold">Niños por nacer</label>
                  <div  className="mt-2">
                    <select
                      name="cantidad"
                      onChange={handleInputChange}
                         disabled={disabled}
                      value={beneficio.cantidad}
                      className={
                        "w-[95%] !border-l-4 !border-[#006084] bg-gray-200 pl-3 text-base font-semibold focus:outline-none p-3"
                      }
                    >
                      <option disabled selected value="">Elegir Cantidad</option>
                      <option value="1">Hijo/a (1)</option>
                      <option value="2">Mellizos (2)</option>
                      <option value="3">Trillizos (3)</option>
                    </select>                    
                    {validationErrors.cantidad && (                      
                      <p className="text-red-500">
                         {validationErrors.cantidad}
                      </p>                                         
                    )}
                  </div>

                  <div className="flex flex-col justify-center items-center mt-4 rounded-xl min-h-[6rem] w-[100%] p-2">
                    <p className="font-bold">Subir Certificado Médico:</p>
                    <p className="text-sm font-semibold text-gray-600 max-w-[80%] text-center mt-1">
                      Recuerda debe estar firmado por un personal de la salud.
                    </p>

                    <label
                      htmlFor="certificado"
                      className="cursor-pointer mt-auto mb-2"
                    >
                      <FiDownload className="text-5xl text-[#23A1D8]" />
                    </label>

                    <input
                      type="file"
                      name="certificado"
                      id="certificado"
                      multiple
                      required
                         disabled={disabled}
                      style={{ display: "none" }}
                      onChange={handleCertificadoChange}
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
                  </div>
                  {validationErrors.certificado && (
                    <p className="text-red-500">
                      {validationErrors.certificado}
                    </p>
                  )}
                </div>
                <div>
                             {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                          )}
                </div>

             <div className="flex justify-end max-sm:pb-2 pt-6">
  {disabled ? (
    <p className="font-bold text-red-500">Ya se otorgó un beneficio durante el año actual.</p>
  ) : (  
    <button
      className="sm:mt-4 bg-[#006084] w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
      onClick={handleRegisterAfiliate}
    >
      Siguiente
    </button>
  )
}
</div>

              </>
            )
          )}
          
        </div>
         {/* {currentStep === 3 && (
            <>
                  <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                    <img className="w-[4rem] text-[#006084]" src={Mono} />
                    <p className="font-extrabold text-3xl text-[#006084]">
                      El beneficio ha sido registrado con éxito.
                    </p>
                    <p className="font-bold text-xl w-[80%] text-gray-500">
                      Por favor, haga entrega de los items correspondientes al beneficio.
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
              )}
             */}
          
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
              ) : mensajeEntrega ?  (
                <>
                  <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                    <img className="w-[4rem] text-[#006084]" src={Mono} />
                    <p className="font-extrabold text-3xl text-[#006084]">
                      El beneficio ha sido registrado con éxito.
                    </p>
                    <p className="font-bold text-xl text-center text-gray-500">
                      Por favor, entregue al afiliado el Kit de Nacimiento.
                    </p>
                  </div>
                  <div className="h-full w-full items-end pb-10 justify-center flex">
                    <button
                      className="btn w-1/3"
                      onClick={() => navigate("/home")}
                    >
                      <span>FINALIZAR</span>
                    </button>
                  </div>
                </>
              )
            :
            (
                <>
                  <div className="flex flex-col h-full w-full justify-end items-center space-y-4">
                    <img className="w-[4rem] text-[#006084]" src={Mono} />
                    <p className="font-extrabold text-3xl text-[#006084]">
                      El beneficio ha sido registrado con éxito.
                    </p>
                    <p className="font-bold text-xl w-[80%] text-gray-500">
                      Por favor, informe al afiliado que un representante se pondra en contacto para continuar con la gestion del beneficio.
                    </p>
                  </div>
                  <div className="h-full w-full items-end pb-10 justify-center flex">
                    <button
                      className="btn w-1/3"
                      onClick={() => navigate("/home")}
                    >
                      <span>FINALIZAR</span>
                    </button>
                  </div>
                </>
              )
            }
            </>
          )}
      </div>
      
    </div>
     <Modal
            isOpen={modalIsOpen}
            // onRequestClose={() => setModalIsOpen(false)}
              shouldCloseOnOverlayClick={false} 
            contentLabel="Entregar Beneficio"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "2rem",
                width: "80%",
                maxWidth: "40rem",
              },
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Entregar beneficio pendiente.</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-2">
             {isLoading? <Loader/> : conyugue.length > 0 &&
             conyugue.map((familiar) => (
              Object.keys(beneficiosOtorgados[familiar.id]).length > 0 &&
                      <div key={familiar.id} className="flex justify-center items-center">
                        <div className="flex flex-col w-[95%] ">
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
                            Fecha de Solicitud
                          </label>

                          <div
                            key={familiar.id}
                            className={
                              "flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                            }
                          >
                            <label className="font-semibold text-black p-3">
                                   {beneficiosOtorgados[familiar.id] && 
                                   <>                             
                                   { new Date(beneficiosOtorgados[familiar.id][0].fecha_otorgamiento).toLocaleDateString()}{" "}
                                    {new Date(beneficiosOtorgados[familiar.id][0].fecha_otorgamiento).toLocaleTimeString()
                                   }
                                   </>
                            
                             }
                            </label>
                          </div>

                         
                          <div className="flex flex-col mt-4 items-center">
                          <Files 
                          label="Subir foto de RECIBO DE ENTREGA" 
                          onUpload={() => handleUpdateBeneficio(beneficiosOtorgados[familiar.id][0].id)}
                          instructions="Recuerde que debe estar firmada por el trabajador." 
                            />
                          <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => navigate('/homeInfo')}
                          >
                            Salir al inicio
                          </button>
                          </div>


                          {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                          )}
                        </div>
                      </div>
                    ))
                          }
            </div>
                          

       
          </Modal>

          <Modal
            isOpen={modalMadreIsOpen}
            // onRequestClose={() => setModalMadreIsOpen(false)}
                  shouldCloseOnOverlayClick={false} 
            contentLabel="Entregar Beneficio"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                border: "none",
                background: "white",
                color: "black",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "2rem",
                width: "80%",
                maxWidth: "40rem",
              },
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Entregar beneficio pendiente.</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-2">

             {isLoading? <Loader/> : Object.keys(beneficiosOtorgados).length > 0 && madres.length > 0 &&
              madres
                .filter((madre) => beneficiosOtorgados[madre.id] && Object.keys(beneficiosOtorgados[madre.id]).length > 0)
                .map((madre) => (
                      <div key={madre.id} className="flex justify-center items-center">
                        <div className="flex flex-col w-[95%] ">
                          <label className="font-semibold mt-4 ">
                            Nombre y Apellido
                          </label>

                          <div
                            key={madre.id}
                            className={`flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200  `}
                          >
                            <label
                              htmlFor={`familiar_${madre.id}`}
                              className="capitalize font-semibold text-black p-3"
                            >
                              {madre.name}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">DNI</label>

                          <div
                            key={madre.id}
                            className="flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                          >
                            <label className="font-semibold text-black p-3 ">
                              {madre.dni}
                            </label>
                          </div>

                          <label className="font-semibold mt-2 ">
                            Fecha de Solicitud
                          </label>

                          <div
                            key={madre.id}
                            className={
                              "flex  items-center mt-2 justify-between border-l-4 border-[#006084] w-[95%] bg-gray-200"
                            }
                          >
                            <label className="font-semibold text-black p-3">
                                   {beneficiosOtorgados[madre.id] && 
                                   <>                             
                                   { new Date(beneficiosOtorgados[madre.id][0].fecha_otorgamiento).toLocaleDateString()}{" "}
                                    {new Date(beneficiosOtorgados[madre.id][0].fecha_otorgamiento).toLocaleTimeString()
                                   }
                                   </>
                            
                             }
                            </label>
                          </div>

                         
                          <div className="flex flex-col mt-4 items-center">
                          <Files 
                          label="Subir foto de RECIBO DE ENTREGA" 
                          onUpload={() => handleUpdateBeneficio(beneficiosOtorgados[madre.id][0].id)}
                          instructions="Recuerde que debe estar firmada por el trabajador." 
                            />
                          <button
                            className="mt-4 bg-red-600 w-36 font-bold text-white rounded-lg p-2 hover:bg-opacity-75"
                            onClick={() => navigate('/homeInfo')}
                          >
                            Salir al Inicio
                          </button>
                          </div>


                          {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                          )}
                        </div>
                      </div>
                    ))
                          }
            </div>
                          

       
          </Modal>
 
  </div>

  
    
);

  
};

export default KitMaternal;
